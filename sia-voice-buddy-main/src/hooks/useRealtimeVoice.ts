import { useCallback, useEffect, useRef, useState } from "react";
import { createRealtimeSession } from "@/lib/realtime.functions";
import type { SiaSettings, SiaState, TranscriptMessage } from "@/types/sia";

type Options = {
  settings: SiaSettings;
  onMessage: (message: TranscriptMessage) => void;
};

function makeId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function analyserFor(ctx: AudioContext, stream: MediaStream) {
  const source = ctx.createMediaStreamSource(stream);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 512;
  analyser.smoothingTimeConstant = 0.75;
  source.connect(analyser);
  return analyser;
}

export function useRealtimeVoice({ settings, onMessage }: Options) {
  const [state, setState] = useState<SiaState>("IDLE");
  const [error, setError] = useState<string | null>(null);
  const [inputLevel, setInputLevel] = useState(0);
  const [outputLevel, setOutputLevel] = useState(0);
  const [liveUserText, setLiveUserText] = useState("");
  const [liveAssistantText, setLiveAssistantText] = useState("");

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const settingsRef = useRef(settings);
  const onMessageRef = useRef(onMessage);
  settingsRef.current = settings;
  onMessageRef.current = onMessage;

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    dcRef.current?.close();
    dcRef.current = null;
    pcRef.current?.getSenders().forEach((s) => s.track?.stop());
    pcRef.current?.close();
    pcRef.current = null;
    micStreamRef.current?.getTracks().forEach((t) => t.stop());
    micStreamRef.current = null;
    if (audioElRef.current) {
      audioElRef.current.srcObject = null;
      audioElRef.current.remove();
      audioElRef.current = null;
    }
    void audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    setInputLevel(0);
    setOutputLevel(0);
    setLiveUserText("");
    setLiveAssistantText("");
    setState("IDLE");
  }, []);

  useEffect(() => () => stop(), [stop]);

  // Volume aplicado em tempo real
  useEffect(() => {
    if (audioElRef.current) audioElRef.current.volume = settings.volume;
  }, [settings.volume]);

  const handleEvent = useCallback((evt: Record<string, unknown>) => {
    const type = String(evt["type"] ?? "");

    switch (type) {
      case "input_audio_buffer.speech_started":
        setState("LISTENING");
        setLiveAssistantText("");
        break;
      case "input_audio_buffer.speech_stopped":
        setState("PROCESSING");
        break;
      case "conversation.item.input_audio_transcription.delta":
        setLiveUserText((prev) => prev + String(evt["delta"] ?? ""));
        break;
      case "conversation.item.input_audio_transcription.completed": {
        const text = String(evt["transcript"] ?? "").trim();
        setLiveUserText("");
        if (text) {
          onMessageRef.current({
            id: makeId(),
            role: "user",
            content: text,
            createdAt: Date.now(),
          });
        }
        break;
      }
      case "response.output_audio_transcript.delta":
      case "response.audio_transcript.delta":
        setState("SPEAKING");
        setLiveAssistantText((prev) => prev + String(evt["delta"] ?? ""));
        break;
      case "response.output_audio_transcript.done":
      case "response.audio_transcript.done": {
        const text = String(evt["transcript"] ?? "").trim();
        setLiveAssistantText("");
        if (text) {
          onMessageRef.current({
            id: makeId(),
            role: "assistant",
            content: text,
            createdAt: Date.now(),
          });
        }
        break;
      }
      case "response.done":
        setState((s) => (s === "SPEAKING" || s === "PROCESSING" ? "LISTENING" : s));
        break;
      case "error": {
        const err = evt["error"] as { message?: string } | undefined;
        setError(err?.message ?? "Erro na sessão da SIA.");
        break;
      }
      default:
        break;
    }
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setState("CONNECTING");

    if (typeof RTCPeerConnection === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError("Seu navegador não suporta conversas por voz em tempo real. Tente o Chrome ou o Edge.");
      setState("ERROR");
      return;
    }

    let mic: MediaStream;
    try {
      mic = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          ...(settingsRef.current.microphoneId
            ? { deviceId: { exact: settingsRef.current.microphoneId } }
            : {}),
        },
      });
    } catch {
      setError(
        "Não consegui acessar seu microfone. Verifique as permissões do navegador e tente novamente.",
      );
      setState("ERROR");
      return;
    }
    micStreamRef.current = mic;

    try {
      const session = await createRealtimeSession({
        data: {
          voice: settingsRef.current.voice,
          personality: settingsRef.current.personality,
          language: settingsRef.current.language,
        },
      });

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      pcRef.current = pc;

      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;
      audioEl.volume = settingsRef.current.volume;
      audioElRef.current = audioEl;

      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const micAnalyser = analyserFor(ctx, mic);
      let outAnalyser: AnalyserNode | null = null;

      pc.ontrack = (e) => {
        const [remote] = e.streams;
        if (!remote) return;
        audioEl.srcObject = remote;
        void audioEl.play().catch(() => {});
        try {
          outAnalyser = analyserFor(ctx, remote);
        } catch {
          outAnalyser = null;
        }
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
          setState("DISCONNECTED");
        }
      };

      mic.getTracks().forEach((track) => pc.addTrack(track, mic));

      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;
      dc.onmessage = (e) => {
        try {
          handleEvent(JSON.parse(e.data as string) as Record<string, unknown>);
        } catch {
          /* ignore */
        }
      };
      dc.onopen = () => setState("LISTENING");

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpRes = await fetch(
        `https://api.openai.com/v1/realtime/calls?model=${encodeURIComponent(session.model)}`,
        {
          method: "POST",
          body: offer.sdp ?? "",
          headers: {
            Authorization: `Bearer ${session.clientSecret}`,
            "Content-Type": "application/sdp",
          },
        },
      );
      if (!sdpRes.ok) {
        throw new Error(`Falha no handshake da conexão de voz (${sdpRes.status}).`);
      }
      const answer = await sdpRes.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answer });

      // Loop de análise de áudio para as animações do orb
      const buf = new Uint8Array(micAnalyser.frequencyBinCount);
      const tick = () => {
        micAnalyser.getByteTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) {
          const v = ((buf[i] ?? 128) - 128) / 128;
          sum += v * v;
        }
        setInputLevel(Math.min(1, Math.sqrt(sum / buf.length) * 4));

        if (outAnalyser) {
          const obuf = new Uint8Array(outAnalyser.frequencyBinCount);
          outAnalyser.getByteTimeDomainData(obuf);
          let osum = 0;
          for (let i = 0; i < obuf.length; i++) {
            const v = ((obuf[i] ?? 128) - 128) / 128;
            osum += v * v;
          }
          setOutputLevel(Math.min(1, Math.sqrt(osum / obuf.length) * 4));
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch (e) {
      mic.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
      setError(e instanceof Error ? e.message : "Não consegui conectar à SIA.");
      setState("ERROR");
    }
  }, [handleEvent]);

  /** Interrompe a fala da SIA imediatamente (barge-in manual). */
  const interrupt = useCallback(() => {
    const dc = dcRef.current;
    if (dc?.readyState === "open") {
      dc.send(JSON.stringify({ type: "response.cancel" }));
      dc.send(JSON.stringify({ type: "output_audio_buffer.clear" }));
    }
    setLiveAssistantText("");
    setState((s) => (s === "SPEAKING" ? "LISTENING" : s));
  }, []);

  const isActive = state !== "IDLE" && state !== "ERROR" && state !== "DISCONNECTED";

  return {
    state,
    error,
    inputLevel,
    outputLevel,
    liveUserText,
    liveAssistantText,
    isActive,
    start,
    stop,
    interrupt,
    clearError: () => setError(null),
  };
}

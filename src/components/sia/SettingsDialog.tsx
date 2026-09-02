import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LANGUAGES, PERSONALITIES, VOICES, type LanguageCode, type Personality } from "@/lib/sia-config";
import type { SiaSettings } from "@/types/sia";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: SiaSettings;
  onChange: (patch: Partial<SiaSettings>) => void;
}

export function SettingsDialog({ open, onOpenChange, settings, onChange }: Props) {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [micLevel, setMicLevel] = useState<number | null>(null);

  useEffect(() => {
    if (!open || !navigator.mediaDevices?.enumerateDevices) return;
    void navigator.mediaDevices
      .enumerateDevices()
      .then((all) => setDevices(all.filter((d) => d.kind === "audioinput")));
  }, [open]);

  async function testMicrophone() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: settings.microphoneId ? { deviceId: { exact: settings.microphoneId } } : true,
      });
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      ctx.createMediaStreamSource(stream).connect(analyser);
      const buf = new Uint8Array(analyser.frequencyBinCount);
      const started = Date.now();
      const tick = () => {
        analyser.getByteTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) {
          const v = ((buf[i] ?? 128) - 128) / 128;
          sum += v * v;
        }
        setMicLevel(Math.min(1, Math.sqrt(sum / buf.length) * 4));
        if (Date.now() - started < 5000) requestAnimationFrame(tick);
        else {
          stream.getTracks().forEach((t) => t.stop());
          void ctx.close();
          setMicLevel(null);
        }
      };
      requestAnimationFrame(tick);
    } catch {
      setMicLevel(null);
    }
  }

  function testAudio() {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 440;
    gain.gain.value = 0.08 * settings.volume;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    setTimeout(() => {
      osc.stop();
      void ctx.close();
    }, 600);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Configurações</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="voz">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="voz">Voz</TabsTrigger>
            <TabsTrigger value="audio">Áudio</TabsTrigger>
            <TabsTrigger value="interface">Interface</TabsTrigger>
          </TabsList>

          <TabsContent value="voz" className="space-y-5 pt-4">
            <Field label="Voz">
              <Select value={settings.voice} onValueChange={(v) => onChange({ voice: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VOICES.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Idioma">
              <Select
                value={settings.language}
                onValueChange={(v) => onChange({ language: v as LanguageCode })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Personalidade">
              <Select
                value={settings.personality}
                onValueChange={(v) => onChange({ personality: v as Personality })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PERSONALITIES.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.label} — {p.hint}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <p className="text-xs text-muted-foreground">
              Alterações de voz, idioma e personalidade valem para a próxima conversa.
            </p>
          </TabsContent>

          <TabsContent value="audio" className="space-y-5 pt-4">
            <Field label={`Volume — ${Math.round(settings.volume * 100)}%`}>
              <Slider
                value={[settings.volume * 100]}
                max={100}
                step={1}
                onValueChange={([v]) => onChange({ volume: (v ?? 100) / 100 })}
              />
            </Field>

            <Field label="Microfone">
              <Select
                value={settings.microphoneId ?? "default"}
                onValueChange={(v) => onChange({ microphoneId: v === "default" ? null : v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Padrão do sistema</SelectItem>
                  {devices.map((d, i) => (
                    <SelectItem key={d.deviceId || i} value={d.deviceId || `mic-${i}`}>
                      {d.label || `Microfone ${i + 1}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <div className="flex gap-2">
              <Button variant="secondary" onClick={testMicrophone}>
                Testar microfone
              </Button>
              <Button variant="secondary" onClick={testAudio}>
                Testar áudio
              </Button>
            </div>
            {micLevel !== null && (
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.round(micLevel * 100)}%` }}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="interface" className="space-y-5 pt-4">
            <Field label="Tema">
              <Select
                value={settings.theme}
                onValueChange={(v) => onChange({ theme: v as SiaSettings["theme"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Escuro</SelectItem>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="system">Seguir sistema</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Transcrição">
              <Select
                value={settings.showTranscript ? "on" : "off"}
                onValueChange={(v) => onChange({ showTranscript: v === "on" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on">Mostrar</SelectItem>
                  <SelectItem value="off">Ocultar</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

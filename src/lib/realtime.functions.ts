import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { SIA_MODEL, buildInstructions } from "./sia-config";

const InputSchema = z.object({
  voice: z.string().default("alloy"),
  personality: z.enum(["natural", "profissional", "amigavel", "objetivo"]).default("natural"),
  language: z.enum(["pt-BR", "en-US", "es-ES"]).default("pt-BR"),
});

export type RealtimeSession = {
  clientSecret: string;
  model: string;
  expiresAt: number | null;
};

/**
 * Cria uma sessão realtime efêmera na OpenAI.
 * A OPENAI_API_KEY nunca sai do servidor — o browser recebe apenas um
 * client secret temporário (ek_...) usado no handshake WebRTC.
 */
export const createRealtimeSession = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data ?? {}))
  .handler(async ({ data }): Promise<RealtimeSession> => {
    const apiKey = process.env["OPENAI_API_KEY"];
    if (!apiKey) {
      throw new Error(
        "OPENAI_API_KEY não configurada no servidor. Adicione a chave nas configurações do projeto.",
      );
    }

    const body = {
      session: {
        type: "realtime",
        model: SIA_MODEL,
        instructions: buildInstructions({
          personality: data.personality,
          language: data.language,
        }),
        audio: {
          input: {
            transcription: { model: "whisper-1" },
            turn_detection: {
              type: "server_vad",
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 500,
              create_response: true,
              interrupt_response: true,
            },
          },
          output: { voice: data.voice },
        },
      },
    };

    const res = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    if (!res.ok) {
      console.error("OpenAI realtime session error", res.status, text);
      throw new Error(
        res.status === 401
          ? "Chave da OpenAI inválida. Verifique a OPENAI_API_KEY."
          : `Falha ao criar sessão realtime (${res.status}).`,
      );
    }

    const json = JSON.parse(text) as {
      value?: string;
      expires_at?: number;
      client_secret?: { value?: string; expires_at?: number };
    };

    const secret = json.value ?? json.client_secret?.value;
    if (!secret) throw new Error("Resposta inesperada da OpenAI ao criar a sessão.");

    return {
      clientSecret: secret,
      model: SIA_MODEL,
      expiresAt: json.expires_at ?? json.client_secret?.expires_at ?? null,
    };
  });

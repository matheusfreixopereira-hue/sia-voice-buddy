import type { LanguageCode, Personality } from "@/lib/sia-config";

export type SiaState =
  | "IDLE"
  | "CONNECTING"
  | "LISTENING"
  | "PROCESSING"
  | "SPEAKING"
  | "ERROR"
  | "DISCONNECTED";

export type TranscriptRole = "user" | "assistant";

export interface TranscriptMessage {
  id: string;
  role: TranscriptRole;
  content: string;
  createdAt: number;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: TranscriptMessage[];
}

export interface SiaSettings {
  voice: string;
  language: LanguageCode;
  personality: Personality;
  volume: number;
  microphoneId: string | null;
  theme: "light" | "dark" | "system";
  showTranscript: boolean;
}

export const DEFAULT_SETTINGS: SiaSettings = {
  voice: "alloy",
  language: "pt-BR",
  personality: "natural",
  volume: 1,
  microphoneId: null,
  theme: "dark",
  showTranscript: true,
};

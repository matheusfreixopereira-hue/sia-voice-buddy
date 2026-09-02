import { Mic, MicOff, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SiaState } from "@/types/sia";

interface Props {
  state: SiaState;
  level: number;
  onStart: () => void;
  onStop: () => void;
}

export function VoiceButton({ state, level, onStart, onStop }: Props) {
  const active = state === "LISTENING" || state === "SPEAKING" || state === "PROCESSING";
  const connecting = state === "CONNECTING";

  const label = connecting
    ? "Conectando..."
    : state === "LISTENING"
      ? "Estou ouvindo"
      : state === "SPEAKING"
        ? "SIA está falando"
        : state === "PROCESSING"
          ? "Pensando..."
          : "Falar com SIA";

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        aria-label={label}
        disabled={connecting}
        onClick={active ? onStop : onStart}
        className={cn(
          "relative flex size-20 items-center justify-center rounded-full transition-all duration-300 sm:size-24",
          "bg-primary text-primary-foreground hover:brightness-110 active:scale-95 disabled:opacity-70",
        )}
        style={{
          boxShadow: `0 0 ${24 + level * 70}px color-mix(in oklch, var(--primary) ${40 + level * 50}%, transparent)`,
          transform: `scale(${1 + level * 0.08})`,
        }}
      >
        {active ? (
          <Square className="size-7 fill-current" />
        ) : state === "ERROR" ? (
          <MicOff className="size-8" />
        ) : (
          <Mic className="size-8" />
        )}
        {active && (
          <span className="absolute inset-0 rounded-full border border-primary-foreground/30 animate-ripple" />
        )}
      </button>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

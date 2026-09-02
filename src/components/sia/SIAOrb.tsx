import { cn } from "@/lib/utils";
import type { SiaState } from "@/types/sia";

interface SIAOrbProps {
  state: SiaState;
  /** 0..1 nível de áudio do microfone */
  inputLevel?: number;
  /** 0..1 nível de áudio da SIA */
  outputLevel?: number;
  className?: string;
}

export function SIAOrb({ state, inputLevel = 0, outputLevel = 0, className }: SIAOrbProps) {
  const level = state === "LISTENING" ? inputLevel : state === "SPEAKING" ? outputLevel : 0;
  const scale = 1 + level * 0.22;
  const glow = 0.35 + level * 0.6;
  const isError = state === "ERROR" || state === "DISCONNECTED";

  return (
    <div className={cn("relative aspect-square w-56 sm:w-72 md:w-80", className)}>
      {/* halo externo */}
      <div
        className="absolute inset-0 rounded-full blur-3xl transition-opacity duration-500"
        style={{
          background: isError
            ? "radial-gradient(circle, color-mix(in oklch, var(--destructive) 45%, transparent), transparent 70%)"
            : "radial-gradient(circle, color-mix(in oklch, var(--primary) 55%, transparent), transparent 70%)",
          opacity: glow,
        }}
      />

      {/* ondas de escuta */}
      {(state === "LISTENING" || state === "SPEAKING") && (
        <>
          <span className="absolute inset-4 rounded-full border border-primary/40 animate-ripple" />
          <span
            className="absolute inset-4 rounded-full border border-accent/30 animate-ripple"
            style={{ animationDelay: "1.2s" }}
          />
        </>
      )}

      {/* anel de processamento */}
      {(state === "PROCESSING" || state === "CONNECTING") && (
        <span className="absolute inset-2 rounded-full border-2 border-transparent border-t-primary border-r-accent/60 animate-spin-slow" />
      )}

      {/* núcleo */}
      <div
        className={cn(
          "absolute inset-6 rounded-full transition-transform duration-100 ease-out",
          state === "IDLE" && "animate-breathe",
        )}
        style={{
          transform: `scale(${scale})`,
          background:
            "radial-gradient(circle at 32% 28%, color-mix(in oklch, var(--accent) 85%, transparent), color-mix(in oklch, var(--primary) 90%, transparent) 45%, color-mix(in oklch, var(--aurora) 80%, transparent) 100%)",
          boxShadow: `0 0 ${40 + level * 90}px color-mix(in oklch, var(--primary) 55%, transparent)`,
        }}
      >
        <div className="absolute inset-0 rounded-full bg-background/10 mix-blend-overlay" />
        <div className="absolute left-[22%] top-[18%] h-1/4 w-1/4 rounded-full bg-background/40 blur-md" />
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
import type { SiaState } from "@/types/sia";

const MAP: Record<SiaState, { label: string; color: string }> = {
  IDLE: { label: "SIA pronta", color: "bg-muted-foreground" },
  CONNECTING: { label: "Conectando...", color: "bg-pending" },
  LISTENING: { label: "SIA online", color: "bg-online" },
  PROCESSING: { label: "SIA online", color: "bg-online" },
  SPEAKING: { label: "SIA online", color: "bg-online" },
  ERROR: { label: "Erro de conexão", color: "bg-destructive" },
  DISCONNECTED: { label: "Desconectado", color: "bg-destructive" },
};

export function ConnectionStatus({ state }: { state: SiaState }) {
  const item = MAP[state];
  return (
    <div className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs text-muted-foreground glass-panel">
      <span className={cn("size-2 rounded-full", item.color)} />
      <span className="hidden sm:inline">{item.label}</span>
    </div>
  );
}

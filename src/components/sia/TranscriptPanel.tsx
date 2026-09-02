import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { TranscriptMessage } from "@/types/sia";

interface Props {
  messages: TranscriptMessage[];
  liveUserText?: string;
  liveAssistantText?: string;
}

export function TranscriptPanel({ messages, liveUserText, liveAssistantText }: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, liveUserText, liveAssistantText]);

  const empty = messages.length === 0 && !liveUserText && !liveAssistantText;
  if (empty) return null;

  return (
    <div className="mx-auto max-h-44 w-full max-w-2xl overflow-y-auto rounded-2xl px-4 py-3 text-sm glass-panel">
      <div className="space-y-2.5">
        {messages.slice(-12).map((m) => (
          <Line key={m.id} role={m.role} text={m.content} />
        ))}
        {liveUserText && <Line role="user" text={liveUserText} pending />}
        {liveAssistantText && <Line role="assistant" text={liveAssistantText} pending />}
        <div ref={endRef} />
      </div>
    </div>
  );
}

function Line({
  role,
  text,
  pending,
}: {
  role: "user" | "assistant";
  text: string;
  pending?: boolean;
}) {
  return (
    <div className={cn("animate-rise", pending && "opacity-70")}>
      <span
        className={cn(
          "mr-2 text-[11px] font-semibold uppercase tracking-widest",
          role === "user" ? "text-muted-foreground" : "text-primary",
        )}
      >
        {role === "user" ? "Você" : "SIA"}
      </span>
      <span className="text-foreground/90">{text}</span>
    </div>
  );
}

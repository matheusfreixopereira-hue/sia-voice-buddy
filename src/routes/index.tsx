import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { History, Settings as SettingsIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectionStatus } from "@/components/sia/ConnectionStatus";
import { ConversationHistory } from "@/components/sia/ConversationHistory";
import { SIAOrb } from "@/components/sia/SIAOrb";
import { SettingsDialog } from "@/components/sia/SettingsDialog";
import { TranscriptPanel } from "@/components/sia/TranscriptPanel";
import { VoiceButton } from "@/components/sia/VoiceButton";
import { useConversations } from "@/hooks/useConversations";
import { useRealtimeVoice } from "@/hooks/useRealtimeVoice";
import { useSettings } from "@/hooks/useSettings";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SIA — Assistente de IA por voz em tempo real" },
      {
        name: "description",
        content:
          "Converse por voz em tempo real com a SIA, sua assistente de IA: respostas naturais, transcrição ao vivo e histórico de conversas.",
      },
      { property: "og:title", content: "SIA — Super IA Assistant" },
      {
        property: "og:description",
        content: "Assistente pessoal de IA por voz em tempo real, com conversa natural e fluida.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { settings, update } = useSettings();
  const { conversations, active, activeId, setActiveId, startNew, appendMessage, remove } =
    useConversations();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const onMessage = useCallback(appendMessage, [appendMessage]);

  const {
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
    clearError,
  } = useRealtimeVoice({ settings, onMessage });

  const level = state === "SPEAKING" ? outputLevel : inputLevel;

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      {/* aurora de fundo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 15%, color-mix(in oklch, var(--primary) 18%, transparent), transparent 70%), radial-gradient(45% 40% at 80% 80%, color-mix(in oklch, var(--aurora) 16%, transparent), transparent 70%)",
        }}
      />

      <header className="relative z-10 flex items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Histórico de conversas"
            onClick={() => setHistoryOpen(true)}
          >
            <History className="size-5" />
          </Button>
          <div>
            <h1 className="font-display text-lg font-semibold leading-none tracking-tight">SIA</h1>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
              Super IA Assistant
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ConnectionStatus state={state} />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Configurações"
            onClick={() => setSettingsOpen(true)}
          >
            <SettingsIcon className="size-5" />
          </Button>
        </div>
      </header>

      <section className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-4 pb-10">
        <SIAOrb state={state} inputLevel={inputLevel} outputLevel={outputLevel} />

        {settings.showTranscript && (
          <TranscriptPanel
            messages={active?.messages ?? []}
            liveUserText={liveUserText}
            liveAssistantText={liveAssistantText}
          />
        )}

        {error && (
          <div className="flex max-w-lg items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-foreground">
            <span className="flex-1">{error}</span>
            <button type="button" aria-label="Fechar erro" onClick={clearError}>
              <X className="size-4" />
            </button>
          </div>
        )}

        <VoiceButton state={state} level={level} onStart={start} onStop={stop} />

        {state === "SPEAKING" && (
          <Button variant="secondary" size="sm" onClick={interrupt}>
            Interromper
          </Button>
        )}

        {!isActive && !error && (
          <p className="max-w-md text-center text-sm text-muted-foreground">
            Toque no botão e fale naturalmente. A SIA escuta, responde por voz e transcreve tudo em
            tempo real.
          </p>
        )}
      </section>

      <ConversationHistory
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        conversations={conversations}
        activeId={activeId}
        onSelect={(id) => {
          setActiveId(id);
          setHistoryOpen(false);
        }}
        onDelete={remove}
        onNew={() => {
          startNew();
          setHistoryOpen(false);
        }}
      />

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={settings}
        onChange={update}
      />
    </main>
  );
}

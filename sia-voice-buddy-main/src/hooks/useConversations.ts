import { useCallback, useEffect, useState } from "react";
import type { Conversation, TranscriptMessage } from "@/types/sia";

const KEY = "sia.conversations.v1";

function load(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as Conversation[];
  } catch {
    return [];
  }
}

function newConversation(): Conversation {
  return {
    id: crypto.randomUUID(),
    title: "Nova conversa",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: [],
  };
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = load();
    setConversations(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(KEY, JSON.stringify(conversations));
  }, [conversations, hydrated]);

  const active = conversations.find((c) => c.id === activeId) ?? null;

  const startNew = useCallback(() => {
    const conv = newConversation();
    setConversations((prev) => [conv, ...prev]);
    setActiveId(conv.id);
    return conv.id;
  }, []);

  const appendMessage = useCallback(
    (message: TranscriptMessage) => {
      setConversations((prev) => {
        let id = activeId;
        let list = prev;
        if (!id || !prev.some((c) => c.id === id)) {
          const conv = newConversation();
          id = conv.id;
          list = [conv, ...prev];
          setActiveId(conv.id);
        }
        return list.map((c) =>
          c.id === id
            ? {
                ...c,
                messages: [...c.messages, message],
                updatedAt: Date.now(),
                title:
                  c.messages.length === 0 && message.role === "user"
                    ? message.content.slice(0, 48)
                    : c.title,
              }
            : c,
        );
      });
    },
    [activeId],
  );

  const remove = useCallback(
    (id: string) => {
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeId === id) setActiveId(null);
    },
    [activeId],
  );

  return { conversations, active, activeId, setActiveId, startNew, appendMessage, remove };
}

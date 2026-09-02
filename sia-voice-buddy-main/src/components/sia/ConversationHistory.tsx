import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/types/sia";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

function group(conversations: Conversation[]) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 86_400_000;

  const buckets: Record<string, Conversation[]> = { Hoje: [], Ontem: [], Anteriores: [] };
  for (const c of [...conversations].sort((a, b) => b.updatedAt - a.updatedAt)) {
    if (c.updatedAt >= startOfToday) buckets["Hoje"]!.push(c);
    else if (c.updatedAt >= startOfYesterday) buckets["Ontem"]!.push(c);
    else buckets["Anteriores"]!.push(c);
  }
  return Object.entries(buckets).filter(([, list]) => list.length > 0);
}

export function ConversationHistory({
  open,
  onOpenChange,
  conversations,
  activeId,
  onSelect,
  onDelete,
  onNew,
}: Props) {
  const groups = group(conversations);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[88vw] max-w-sm border-border bg-sidebar p-0">
        <SheetHeader className="p-5 pb-3">
          <SheetTitle className="text-lg">Conversas</SheetTitle>
        </SheetHeader>

        <div className="px-5">
          <Button variant="secondary" className="w-full justify-start gap-2" onClick={onNew}>
            <Plus className="size-4" /> Nova conversa
          </Button>
        </div>

        <div className="mt-4 space-y-6 overflow-y-auto px-5 pb-8">
          {groups.length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhuma conversa ainda.</p>
          )}
          {groups.map(([label, list]) => (
            <div key={label}>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {label}
              </p>
              <ul className="space-y-1">
                {list.map((c) => (
                  <li key={c.id} className="group flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onSelect(c.id)}
                      className={cn(
                        "flex-1 truncate rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-sidebar-accent",
                        activeId === c.id && "bg-sidebar-accent text-sidebar-accent-foreground",
                      )}
                    >
                      <span className="block truncate">{c.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(c.updatedAt).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Excluir conversa"
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => onDelete(c.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

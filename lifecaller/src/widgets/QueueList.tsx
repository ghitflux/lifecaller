import { useEffect, useState } from "react";
import { Card } from "@/design-system/components/Card";
import { Button } from "@/design-system/components/Button";
import { getQueue } from "@/services/atendimentos";

export type QueueListAction = {
  label: string;
  onClick: () => Promise<void> | void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export type QueueListProps = {
  queue: string;
  title: string;
  actionsFor?: (item: any) => QueueListAction[];
};

export default function QueueList({ queue, title, actionsFor }: QueueListProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getQueue(queue);
      setItems(data?.results ?? data ?? []);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Falha ao carregar fila.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue]);

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="font-semibold">{title}</div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={load} disabled={loading}>
            {loading ? "Atualizando..." : "Atualizar"}
          </Button>
        </div>
      </div>

      {error && <div className="text-sm text-red-400">{error}</div>}

      {loading ? (
        <div className="p-8 text-center text-sm opacity-60">Carregando fila...</div>
      ) : items.length === 0 ? (
        <div className="p-8 text-center text-sm opacity-60">Nenhum item encontrado.</div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-[var(--stroke)] bg-[var(--elev)] p-3 text-sm"
            >
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <div className="font-medium">#{item.id} · {item.cpf} · {item.matricula}</div>
                  <div className="opacity-70">Banco: {item.banco || "—"}</div>
                  <div className="opacity-70">Etapa: {item.stage}</div>
                  {item.assigned_username && (
                    <div className="opacity-70">Atribuído a: {item.assigned_username}</div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 pt-2 md:pt-0">
                  {(actionsFor?.(item) || []).map((action) => (
                    <Button
                      key={action.label}
                      size="sm"
                      variant={action.variant ?? "ghost"}
                      onClick={() => Promise.resolve(action.onClick()).then(load)}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

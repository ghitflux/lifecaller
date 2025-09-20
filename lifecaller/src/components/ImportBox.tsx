import { useRef, useState } from "react";
import { importCsvFormData } from "@/services/atendimentos";

export default function ImportBox({ onDone }: { onDone: ()=>void }) {
  const ref = useRef<HTMLInputElement|null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string>("");

  const send = async () => {
    const f = ref.current?.files?.[0];
    if (!f) return;
    setBusy(true); setMsg("");
    try {
      const fd = new FormData(); fd.append("file", f);
      const res = await importCsvFormData(fd);
      setMsg(`Importado: ${res.created} criados, ${res.updated} atualizados (${res.format}).`);
      onDone();
    } catch (e:any) {
      setMsg(e?.response?.data?.detail || "Falha ao importar.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card p-4 space-y-3">
      <div className="font-semibold">Importar lista (CSV padrão ou relatório iNETConsig .txt)</div>
      <input ref={ref} type="file" accept=".csv,.txt" className="text-sm" />
      <div className="flex items-center gap-2">
        <button disabled={busy} onClick={send} className="h-10 px-4 rounded-xl2 bg-[var(--brand)] text-black">{busy?"Importando...":"Importar"}</button>
        {msg && <span className="text-sm opacity-80">{msg}</span>}
      </div>
    </div>
  );
}

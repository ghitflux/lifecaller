import { useEffect, useMemo, useState } from "react";
import { Calculator, CheckCircle2, Table, XCircle } from "lucide-react";

import { simulate } from "@/services/atendimentos";
import { coefAPI } from "@/services/coeficientes";

type SimuladorModalProps = {
  id: number | string;
  open: boolean;
  onClose: () => void;
};

type CoefRow = {
  id: number;
  banco: string;
  parcelas: number;
  coeficiente: string | number;
};

type FormState = {
  banco: string;
  parcelas: number;
  saldo_devedor: number;
  seguro_banco: number;
  percentual_co: number;
};

const initialForm: FormState = {
  banco: "",
  parcelas: 60,
  saldo_devedor: 0,
  seguro_banco: 0,
  percentual_co: 0.12,
};

export default function SimuladorModal({ id, open, onClose }: SimuladorModalProps) {
  const [rows, setRows] = useState<CoefRow[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setResult(null);
      setError("");
      return;
    }
    coefAPI
      .list()
      .then((data) => {
        const list: CoefRow[] = data?.results ?? data ?? [];
        setRows(list);
        if (!form.banco && list.length) {
          setForm((prev) => ({ ...prev, banco: list[0].banco }));
        }
      })
      .catch(() => setRows([]));
  }, [open]);

  const banks = useMemo(() => Array.from(new Set(rows.map((row) => row.banco))).sort(), [rows]);

  const filteredTable = useMemo(() => {
    if (!form.banco) return rows;
    return rows.filter((row) => row.banco.toLowerCase() === form.banco.toLowerCase());
  }, [rows, form.banco]);

  const updateForm = (key: keyof FormState, value: number | string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const payload = {
        banco: form.banco,
        prazo_meses: form.parcelas,
        parcelas: form.parcelas,
        saldo_devedor: form.saldo_devedor,
        seguro_banco: form.seguro_banco,
        percentual_co: form.percentual_co,
      };
      const response = await simulate(id, payload);
      setResult(response);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Falha na simulação.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const asCurrency = (value?: string | number) => {
    const numeric = Number(value ?? 0);
    if (Number.isNaN(numeric)) return "0,00";
    return numeric.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-5xl rounded-2xl border border-[var(--stroke)] bg-[var(--surface)] p-4 shadow-xl">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Calculator className="h-5 w-5 text-brand" aria-hidden="true" />
            <span>Simulador do Calculista</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-xl2 border border-[var(--stroke)] px-4 text-sm"
          >
            Fechar
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-[var(--stroke)] bg-[var(--elev)] p-4">
            <div className="mb-3 font-semibold">Dados de Entrada</div>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <div>
                <label className="text-xs opacity-80">Banco</label>
                <select
                  className="mt-1 w-full rounded border border-[var(--stroke)] bg-transparent p-2"
                  value={form.banco}
                  onChange={(event) => updateForm("banco", event.target.value)}
                >
                  {banks.map((bank) => (
                    <option key={bank} value={bank}>
                      {bank}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs opacity-80">Parcelas</label>
                <input
                  type="number"
                  className="mt-1 w-full rounded border border-[var(--stroke)] bg-transparent p-2"
                  value={form.parcelas}
                  onChange={(event) => updateForm("parcelas", Number(event.target.value))}
                  min={1}
                />
              </div>
              <div>
                <label className="text-xs opacity-80">Saldo Devedor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  className="mt-1 w-full rounded border border-[var(--stroke)] bg-transparent p-2"
                  value={form.saldo_devedor}
                  onChange={(event) => updateForm("saldo_devedor", Number(event.target.value))}
                  min={0}
                />
              </div>
              <div>
                <label className="text-xs opacity-80">Seguro (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  className="mt-1 w-full rounded border border-[var(--stroke)] bg-transparent p-2"
                  value={form.seguro_banco}
                  onChange={(event) => updateForm("seguro_banco", Number(event.target.value))}
                  min={0}
                />
              </div>
              <div>
                <label className="text-xs opacity-80">Percentual CO (ex.: 0.12 = 12%)</label>
                <input
                  type="number"
                  step="0.0001"
                  className="mt-1 w-full rounded border border-[var(--stroke)] bg-transparent p-2"
                  value={form.percentual_co}
                  onChange={(event) => updateForm("percentual_co", Number(event.target.value))}
                  min={0}
                  max={0.99}
                />
              </div>
              {error && <div className="text-sm text-red-400">{error}</div>}
              <button
                type="submit"
                className="h-10 w-full rounded-xl2 bg-[var(--brand)] text-black transition-opacity hover:opacity-90"
                disabled={loading}
              >
                {loading ? "Calculando…" : "Calcular"}
              </button>
            </form>
          </div>

          <div className="rounded-xl border border-[var(--stroke)] bg-[var(--elev)] p-4">
            <div className="mb-3 font-semibold">Resultados</div>
            {!result && <div className="text-sm opacity-60">Preencha os dados e clique em Calcular…</div>}
            {result && (
              <div className="space-y-2 text-sm">
                <div>
                  {result.aprovado ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/15 px-2 py-1 text-xs text-emerald-300">
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Aprovado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-600/15 px-2 py-1 text-xs text-rose-300">
                      <XCircle className="h-4 w-4" aria-hidden="true" /> Negado
                    </span>
                  )}
                </div>
                <div><b>Coeficiente:</b> {result.coeficiente as string}</div>
                <div><b>Valor da Parcela Total:</b> {asCurrency(result.parcela_total as string | number)}</div>
                <div><b>Valor Liberado (bruto):</b> {asCurrency(result.valor_liberado as string | number)}</div>
                <div><b>PV (Total Financiado):</b> {asCurrency(result.pv_total_financiado as string | number)}</div>
                <div className="opacity-70">
                  Líquido: {asCurrency(result.valor_liquido as string | number)} · CO: {asCurrency(result.custo_consultoria as string | number)} · Cliente: {asCurrency(result.liberado_cliente as string | number)}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center gap-2 font-semibold">
            <Table className="h-4 w-4" aria-hidden="true" />
            Tabela de Coeficientes ({form.banco || "Todos"})
          </div>
          <div className="max-h-64 overflow-auto rounded-xl border border-[var(--stroke)]">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-[var(--surface)] text-left uppercase opacity-70">
                <tr>
                  <th className="px-3 py-2">Banco</th>
                  <th>Parcelas</th>
                  <th>Coeficiente</th>
                </tr>
              </thead>
              <tbody>
                {filteredTable.map((row) => (
                  <tr key={`${row.banco}-${row.parcelas}`} className="border-t border-[var(--stroke)]">
                    <td className="px-3 py-2">{row.banco}</td>
                    <td>{row.parcelas}</td>
                    <td>{row.coeficiente}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTable.length === 0 && (
              <div className="p-3 text-center text-sm opacity-60">Nenhum coeficiente cadastrado.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

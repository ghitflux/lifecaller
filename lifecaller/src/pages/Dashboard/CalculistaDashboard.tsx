import { useEffect, useState } from "react";
import { Calculator, Check, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/design-system/components/Card";
import { Button } from "@/design-system/components/Button";

import { http } from "@/services/http";

interface Atendimento {
  id: number;
  cpf: string;
  matricula: string;
  banco: string;
  stage: string;
  valor_liberado?: number;
  taxa?: number;
  created_at: string;
}

export function CalculistaDashboard() {
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAtendimentos();
  }, []);

  const fetchAtendimentos = async () => {
    try {
      setLoading(true);
      const response = await http.get("/atendimentos/?stage=calculista");
      setAtendimentos(response.data.results || response.data);
    } catch (err: any) {
      setError("Erro ao carregar cálculos pendentes");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = async (id: number) => {
    try {
      // Simular cálculo - em um caso real, isso abriria um modal com formulário
      const valor = prompt("Digite o valor liberado:");
      const taxa = prompt("Digite a taxa (%):");

      if (valor && taxa) {
        await http.post(`/atendimentos/${id}/calculate/`, {
          valor_liberado: parseFloat(valor),
          taxa: parseFloat(taxa)
        });
        await fetchAtendimentos();
      }
    } catch (err: any) {
      setError("Erro ao processar cálculo");
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await http.post(`/atendimentos/${id}/forward/`, {
        stage: "atendente_pos_sim"
      });
      await fetchAtendimentos();
    } catch (err: any) {
      setError("Erro ao aprovar cálculo");
    }
  };

  const handleReject = async (id: number) => {
    try {
      const motivo = prompt("Motivo da reprovação:");
      if (motivo) {
        await http.post(`/atendimentos/${id}/note/`, {
          note: `REPROVADO: ${motivo}`
        });
        await fetchAtendimentos();
      }
    } catch (err: any) {
      setError("Erro ao reprovar cálculo");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div className="space-y-xl">
      <div>
        <h1 className="heading-1 text-text-primary mb-md">
          Dashboard Calculista
        </h1>
        <p className="body-text text-text-secondary">
          Analise e processe cálculos financeiros
        </p>
      </div>

      {error && (
        <Card variant="flat" className="border-feedback-danger bg-red-50">
          <CardContent className="p-md">
            <p className="text-sm text-feedback-danger">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        <Card>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-feedback-warning mb-sm">
                {atendimentos.length}
              </div>
              <div className="text-sm text-text-secondary">
                Cálculos Pendentes
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-feedback-success mb-sm">
                0
              </div>
              <div className="text-sm text-text-secondary">
                Processados Hoje
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-feedback-info mb-sm">
                {atendimentos.reduce((sum, a) => sum + (a.valor_liberado || 0), 0).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </div>
              <div className="text-sm text-text-secondary">
                Volume Total
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calculadora Quick */}
      <Card>
        <CardHeader>
          <CardTitle>Calculadora Rápida</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-sm">
                Valor do Empréstimo
              </label>
              <input
                type="number"
                className="w-full h-input px-md rounded-lg border border-surface-stroke bg-surface-bg"
                placeholder="R$ 0,00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-sm">
                Taxa (% a.m.)
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full h-input px-md rounded-lg border border-surface-stroke bg-surface-bg"
                placeholder="0,00%"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-sm">
                Parcelas
              </label>
              <input
                type="number"
                className="w-full h-input px-md rounded-lg border border-surface-stroke bg-surface-bg"
                placeholder="12"
              />
            </div>
          </div>
          <div className="mt-md">
            <Button variant="primary">
              <Calculator className="mr-2 h-4 w-4" aria-hidden="true" />
              Calcular Parcela
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Atendimentos para Cálculo */}
      <Card>
        <CardHeader>
          <CardTitle>Fila de Cálculos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-stroke">
                  <th className="text-left p-md text-sm font-medium text-text-secondary">
                    ID
                  </th>
                  <th className="text-left p-md text-sm font-medium text-text-secondary">
                    CPF
                  </th>
                  <th className="text-left p-md text-sm font-medium text-text-secondary">
                    Banco
                  </th>
                  <th className="text-left p-md text-sm font-medium text-text-secondary">
                    Valor
                  </th>
                  <th className="text-left p-md text-sm font-medium text-text-secondary">
                    Taxa
                  </th>
                  <th className="text-left p-md text-sm font-medium text-text-secondary">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {atendimentos.map((atendimento) => (
                  <tr key={atendimento.id} className="border-b border-surface-stroke">
                    <td className="p-md text-sm">{atendimento.id}</td>
                    <td className="p-md text-sm">{atendimento.cpf}</td>
                    <td className="p-md text-sm">{atendimento.banco}</td>
                    <td className="p-md text-sm">
                      {atendimento.valor_liberado
                        ? atendimento.valor_liberado.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          })
                        : "Pendente"
                      }
                    </td>
                    <td className="p-md text-sm">
                      {atendimento.taxa ? `${atendimento.taxa}%` : "Pendente"}
                    </td>
                    <td className="p-md">
                      <div className="flex gap-sm">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleCalculate(atendimento.id)}
                        >
                          <Calculator className="mr-1 h-4 w-4" aria-hidden="true" />
                          Calcular
                        </Button>
                        {atendimento.valor_liberado && (
                          <>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleApprove(atendimento.id)}
                            >
                              <Check className="mr-1 h-4 w-4" aria-hidden="true" />
                              Aprovar
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleReject(atendimento.id)}
                            >
                              <XCircle className="mr-1 h-4 w-4" aria-hidden="true" />
                              Reprovar
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {atendimentos.length === 0 && (
              <div className="text-center py-xl">
                <p className="text-text-secondary">
                  Nenhum cálculo pendente
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

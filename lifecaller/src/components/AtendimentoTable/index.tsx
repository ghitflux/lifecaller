import { useState } from "react";
import { Calculator, ClipboardList, Eye } from "lucide-react";
import { Button } from "@/design-system/components/Button";
import { StatusBadge } from "@/design-system/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/design-system/components/Card";
import { type Atendimento } from "@/services/api/atendimentos";

interface AtendimentoTableProps {
  atendimentos: Atendimento[];
  loading?: boolean;
  onClaim?: (id: number) => void;
  onRelease?: (id: number) => void;
  onForward?: (id: number, stage: string) => void;
  onCalculate?: (id: number) => void;
  onView?: (id: number) => void;
  showActions?: boolean;
  currentUserId?: number;
}

const getStatusVariant = (stage: string) => {
  const stageToStatus: Record<string, string> = {
    esteira_global: "pendente",
    atendente: "em_atendimento",
    calculista: "aguardando_aprovacao",
    atendente_pos_sim: "em_atendimento",
    gerente_fechamento: "aprovado",
    atendente_docs: "em_atendimento",
    financeiro: "aprovado",
    contratos_supervisao: "contrato_formalizado"
  };
  return stageToStatus[stage] || "pendente";
};

const getStageLabel = (stage: string) => {
  const labels: Record<string, string> = {
    esteira_global: "Esteira Global",
    atendente: "Em Atendimento",
    calculista: "Calculista",
    atendente_pos_sim: "Pós-Simulação",
    gerente_fechamento: "Fechamento",
    atendente_docs: "Documentação",
    financeiro: "Financeiro",
    contratos_supervisao: "Supervisão"
  };
  return labels[stage] || stage;
};

export function AtendimentoTable({
  atendimentos,
  loading = false,
  onClaim,
  onRelease,
  onForward,
  onCalculate,
  onView,
  showActions = true,
  currentUserId
}: AtendimentoTableProps) {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(atendimentos.map(a => a.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(item => item !== id));
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Atendimentos ({atendimentos.length})</CardTitle>
          {selectedItems.length > 0 && (
            <div className="flex items-center gap-sm">
              <span className="text-sm text-text-secondary">
                {selectedItems.length} selecionados
              </span>
              <Button size="sm" variant="secondary">
                Ações em lote
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-stroke">
                <th className="text-left p-md">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === atendimentos.length && atendimentos.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-surface-stroke"
                  />
                </th>
                <th className="text-left p-md text-sm font-medium text-text-secondary">
                  ID
                </th>
                <th className="text-left p-md text-sm font-medium text-text-secondary">
                  CPF
                </th>
                <th className="text-left p-md text-sm font-medium text-text-secondary">
                  Matrícula
                </th>
                <th className="text-left p-md text-sm font-medium text-text-secondary">
                  Banco
                </th>
                <th className="text-left p-md text-sm font-medium text-text-secondary">
                  Status
                </th>
                <th className="text-left p-md text-sm font-medium text-text-secondary">
                  Valor
                </th>
                <th className="text-left p-md text-sm font-medium text-text-secondary">
                  Criado em
                </th>
                {showActions && (
                  <th className="text-left p-md text-sm font-medium text-text-secondary">
                    Ações
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {atendimentos.map((atendimento) => (
                <tr key={atendimento.id} className="border-b border-surface-stroke hover:bg-surface-elevation">
                  <td className="p-md">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(atendimento.id)}
                      onChange={(e) => handleSelectItem(atendimento.id, e.target.checked)}
                      className="rounded border-surface-stroke"
                    />
                  </td>
                  <td className="p-md text-sm font-mono">{atendimento.id}</td>
                  <td className="p-md text-sm font-mono">{atendimento.cpf}</td>
                  <td className="p-md text-sm">{atendimento.matricula}</td>
                  <td className="p-md text-sm">{atendimento.banco}</td>
                  <td className="p-md">
                    <StatusBadge
                      variant={getStatusVariant(atendimento.stage) as any}
                      customLabel={getStageLabel(atendimento.stage)}
                    />
                  </td>
                  <td className="p-md text-sm">
                    {atendimento.latest_simulacao?.valor_liberado
                      ? atendimento.latest_simulacao.valor_liberado.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })
                      : "-"
                    }
                  </td>
                  <td className="p-md text-sm text-text-secondary">
                    {new Date(atendimento.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  {showActions && (
                    <td className="p-md">
                      <div className="flex gap-sm">
                        {onView && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onView(atendimento.id)}
                            aria-label="Ver atendimento"
                          >
                            <Eye className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        )}

                        {/* Claim/Release logic */}
                        {atendimento.owner_atendente === currentUserId ? (
                          onRelease && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => onRelease(atendimento.id)}
                            >
                              Liberar
                            </Button>
                          )
                        ) : atendimento.stage === "esteira_global" && onClaim ? (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => onClaim(atendimento.id)}
                          >
                            Reivindicar
                          </Button>
                        ) : null}

                        {/* Calculate button for calculista stage */}
                        {atendimento.stage === "calculista" && onCalculate && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => onCalculate(atendimento.id)}
                          >
                            <Calculator className="mr-1 h-4 w-4" aria-hidden="true" />
                            Calcular
                          </Button>
                        )}

                        {/* Forward button */}
                        {onForward && atendimento.owner_atendente === currentUserId && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => onForward(atendimento.id, "next")}
                          >
                            Avançar
                          </Button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {atendimentos.length === 0 && (
            <div className="text-center py-xl">
              <div className="mb-md flex justify-center">
                <ClipboardList className="h-10 w-10 text-text-secondary" aria-hidden="true" />
              </div>
              <p className="text-text-secondary">
                Nenhum atendimento encontrado
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

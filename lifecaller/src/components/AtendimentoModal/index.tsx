import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/design-system/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/design-system/components/Card";
import { type Atendimento, AtendimentosService } from "@/services/api/atendimentos";

interface AtendimentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  atendimento?: Atendimento | null;
  mode: "create" | "edit" | "view";
}

export function AtendimentoModal({
  isOpen,
  onClose,
  onSave,
  atendimento,
  mode
}: AtendimentoModalProps) {
  const [formData, setFormData] = useState({
    cpf: "",
    matricula: "",
    banco: "",
    valor_liberado: "",
    taxa: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (atendimento) {
      setFormData({
        cpf: atendimento.cpf || "",
        matricula: atendimento.matricula || "",
        banco: atendimento.banco || "",
        valor_liberado: ((atendimento as any).valor_liberado ?? "").toString(),
        taxa: ((atendimento as any).taxa ?? "").toString()
      });
    } else {
      setFormData({
        cpf: "",
        matricula: "",
        banco: "",
        valor_liberado: "",
        taxa: ""
      });
    }
  }, [atendimento, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "create") {
        await AtendimentosService.create({
          cpf: formData.cpf,
          matricula: formData.matricula,
          banco: formData.banco
        });
      } else if (mode === "edit" && atendimento) {
        const updateData: any = {
          cpf: formData.cpf,
          matricula: formData.matricula,
          banco: formData.banco
        };

        if (formData.valor_liberado) {
          updateData.valor_liberado = parseFloat(formData.valor_liberado);
        }
        if (formData.taxa) {
          updateData.taxa = parseFloat(formData.taxa);
        }

        await AtendimentosService.update(atendimento.id, updateData);
      }

      onSave();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Erro ao salvar atendimento");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  const isReadOnly = mode === "view";
  const title = mode === "create" ? "Novo Atendimento" :
                mode === "edit" ? "Editar Atendimento" : "Visualizar Atendimento";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-lg">
      <div className="bg-surface-card rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <Card variant="flat" className="border-0 shadow-none">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{title}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-text-secondary hover:text-text-primary"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-lg p-md bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-sm">
                    CPF *
                  </label>
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    required
                    disabled={isReadOnly}
                    className="w-full h-input px-md rounded-lg border border-surface-stroke bg-surface-bg text-text-primary disabled:bg-surface-elevation disabled:text-text-secondary"
                    placeholder="000.000.000-00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-sm">
                    Matrícula *
                  </label>
                  <input
                    type="text"
                    name="matricula"
                    value={formData.matricula}
                    onChange={handleChange}
                    required
                    disabled={isReadOnly}
                    className="w-full h-input px-md rounded-lg border border-surface-stroke bg-surface-bg text-text-primary disabled:bg-surface-elevation disabled:text-text-secondary"
                    placeholder="Digite a matrícula"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-sm">
                    Banco *
                  </label>
                  <select
                    name="banco"
                    value={formData.banco}
                    onChange={handleChange}
                    required
                    disabled={isReadOnly}
                    className="w-full h-input px-md rounded-lg border border-surface-stroke bg-surface-bg text-text-primary disabled:bg-surface-elevation disabled:text-text-secondary"
                  >
                    <option value="">Selecione um banco</option>
                    <option value="banco_do_brasil">Banco do Brasil</option>
                    <option value="caixa">Caixa Econômica Federal</option>
                    <option value="itau">Itaú</option>
                    <option value="bradesco">Bradesco</option>
                    <option value="santander">Santander</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>

                {atendimento && (
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-sm">
                      Status
                    </label>
                    <input
                      type="text"
                      value={atendimento.stage}
                      disabled
                      className="w-full h-input px-md rounded-lg border border-surface-stroke bg-surface-elevation text-text-secondary"
                    />
                  </div>
                )}

                {(mode === "edit" || mode === "view") && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-sm">
                        Valor Liberado
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="valor_liberado"
                        value={formData.valor_liberado}
                        onChange={handleChange}
                        disabled={isReadOnly}
                        className="w-full h-input px-md rounded-lg border border-surface-stroke bg-surface-bg text-text-primary disabled:bg-surface-elevation disabled:text-text-secondary"
                        placeholder="0,00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-sm">
                        Taxa (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="taxa"
                        value={formData.taxa}
                        onChange={handleChange}
                        disabled={isReadOnly}
                        className="w-full h-input px-md rounded-lg border border-surface-stroke bg-surface-bg text-text-primary disabled:bg-surface-elevation disabled:text-text-secondary"
                        placeholder="0,00%"
                      />
                    </div>
                  </>
                )}
              </div>

              {atendimento && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg pt-lg border-t border-surface-stroke">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-sm">
                      Criado em
                    </label>
                    <input
                      type="text"
                      value={new Date(atendimento.created_at).toLocaleString('pt-BR')}
                      disabled
                      className="w-full h-input px-md rounded-lg border border-surface-stroke bg-surface-elevation text-text-secondary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-sm">
                      Atualizado em
                    </label>
                    <input
                      type="text"
                      value={new Date(atendimento.updated_at).toLocaleString('pt-BR')}
                      disabled
                      className="w-full h-input px-md rounded-lg border border-surface-stroke bg-surface-elevation text-text-secondary"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-md pt-lg border-t border-surface-stroke">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                >
                  {isReadOnly ? "Fechar" : "Cancelar"}
                </Button>

                {!isReadOnly && (
                  <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                  >
                    {loading ? "Salvando..." : mode === "create" ? "Criar" : "Salvar"}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

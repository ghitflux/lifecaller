import { useState, useEffect, useMemo } from "react";
import { BarChart3, FolderOpen, Globe, Plus, RefreshCcw, UserRound } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/design-system/components/Card";
import { Button } from "@/design-system/components/Button";
import { AtendimentoTable } from "@/components/AtendimentoTable";
import { AtendimentoModal } from "@/components/AtendimentoModal";
import { AtendimentosService, type Atendimento } from "@/services/api/atendimentos";

export function EsteiraDashboard() {
  const { user } = useAuth();
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [selectedAtendimento, setSelectedAtendimento] = useState<Atendimento | null>(null);
  const [viewMode, setViewMode] = useState<"global" | "mine">("global");

  useEffect(() => {
    fetchAtendimentos();
  }, []);

  const filteredAtendimentos = useMemo(() => {
    if (viewMode === "mine" && user?.id) {
      return atendimentos.filter(
        (item) => item.assigned_to === user.id || item.owner_atendente === user.id,
      );
    }
    return atendimentos;
  }, [atendimentos, viewMode, user?.id]);

  const fetchAtendimentos = async () => {
    try {
      setLoading(true);
      const response = await AtendimentosService.list();
      setAtendimentos(response.results || []);
    } catch (err: any) {
      setError("Erro ao carregar atendimentos");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (id: number) => {
    try {
      await AtendimentosService.claim(id);
      await fetchAtendimentos();
    } catch (err: any) {
      setError("Erro ao reivindicar atendimento");
    }
  };

  const handleRelease = async (id: number) => {
    try {
      await AtendimentosService.release(id);
      await fetchAtendimentos();
    } catch (err: any) {
      setError("Erro ao liberar atendimento");
    }
  };

  const handleCreate = () => {
    setSelectedAtendimento(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const handleView = async (id: number) => {
    try {
      const atendimento = await AtendimentosService.get(id);
      setSelectedAtendimento(atendimento);
      setModalMode("view");
      setModalOpen(true);
    } catch (err: any) {
      setError("Erro ao carregar detalhes do atendimento");
    }
  };

  const handleModalSave = () => {
    fetchAtendimentos();
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
          Esteira de Atendimento
        </h1>
        <p className="body-text text-text-secondary">
          Gerencie seus atendimentos e processos
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-lg">
        <Card>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand mb-sm">
                {atendimentos.length}
              </div>
              <div className="text-sm text-text-secondary">
                Total de Atendimentos
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-feedback-warning mb-sm">
                {atendimentos.filter(a => a.owner_atendente === user?.id).length}
              </div>
              <div className="text-sm text-text-secondary">
                Meus Atendimentos
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-feedback-info mb-sm">
                {atendimentos.filter(a => a.stage === "esteira_global").length}
              </div>
              <div className="text-sm text-text-secondary">
                Disponíveis
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-feedback-success mb-sm">
                {atendimentos.filter(a => a.stage === "atendente").length}
              </div>
              <div className="text-sm text-text-secondary">
                Em Atendimento
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <Card>
        <CardContent>
          <div className="flex flex-col gap-md md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-md">
              <Button
                variant="primary"
                onClick={handleCreate}
              >
                <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
                Novo Atendimento
              </Button>
              <Button
                variant="secondary"
                onClick={fetchAtendimentos}
              >
                <RefreshCcw className="mr-1.5 h-4 w-4" aria-hidden="true" />
                Atualizar
              </Button>
            </div>
            <div className="flex items-center gap-md">
              <div className="flex rounded-full border border-surface-stroke overflow-hidden">
                <button
                  type="button"
                  className={`px-md py-sm text-sm transition-colors ${
                    viewMode === "global"
                      ? "bg-brand text-text-inverse"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                  onClick={() => setViewMode("global")}
                >
                  <span className="flex items-center gap-sm">
                    <Globe className="h-4 w-4" aria-hidden="true" />
                    Esteira Global
                  </span>
                </button>
                <button
                  type="button"
                  className={`px-md py-sm text-sm transition-colors ${
                    viewMode === "mine"
                      ? "bg-brand text-text-inverse"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                  onClick={() => setViewMode("mine")}
                >
                  <span className="flex items-center gap-sm">
                    <UserRound className="h-4 w-4" aria-hidden="true" />
                    Minha Esteira
                  </span>
                </button>
              </div>
              <Button variant="ghost" size="sm">
                <BarChart3 className="mr-1 h-4 w-4" aria-hidden="true" />
                Exportar
              </Button>
              <Button variant="ghost" size="sm">
                <FolderOpen className="mr-1 h-4 w-4" aria-hidden="true" />
                Importar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Atendimentos Table */}
      <AtendimentoTable
        atendimentos={filteredAtendimentos}
        loading={loading}
        onClaim={handleClaim}
        onRelease={handleRelease}
        onView={handleView}
        currentUserId={user?.id}
      />

      {/* Modal */}
      <AtendimentoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleModalSave}
        atendimento={selectedAtendimento}
        mode={modalMode}
      />
    </div>
  );
}

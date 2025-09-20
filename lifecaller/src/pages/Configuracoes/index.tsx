import React, { useEffect, useMemo, useState } from "react";
import { Bell, Settings, UserRound } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/design-system/components/Card";
import { Button } from "@/design-system/components/Button";

export function ConfiguracoesPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const allowedTabs = useMemo(() => ["profile", "notifications", "preferences"], []);
  const queryTab = searchParams.get("tab") || "profile";
  const initialTab = allowedTabs.includes(queryTab) ? queryTab : "profile";

  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const current = searchParams.get("tab");
    if (current && allowedTabs.includes(current) && current !== activeTab) {
      setActiveTab(current);
    }
  }, [searchParams, allowedTabs, activeTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <div className="space-y-xl">
      <div>
        <h1 className="heading-1 text-text-primary mb-md">Configurações</h1>
        <p className="body-text text-text-secondary">
          Gerencie suas preferências e configurações pessoais
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-surface-stroke">
        <nav className="flex space-x-lg">
          <button
            onClick={() => handleTabChange("profile")}
            className={`pb-md border-b-2 transition-colors ${
              activeTab === "profile"
                ? "border-brand text-brand"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            <span className="flex items-center gap-sm">
              <UserRound className="h-4 w-4" aria-hidden="true" />
              Perfil
            </span>
          </button>
          <button
            onClick={() => handleTabChange("notifications")}
            className={`pb-md border-b-2 transition-colors ${
              activeTab === "notifications"
                ? "border-brand text-brand"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            <span className="flex items-center gap-sm">
              <Bell className="h-4 w-4" aria-hidden="true" />
              Notificações
            </span>
          </button>
          <button
            onClick={() => handleTabChange("preferences")}
            className={`pb-md border-b-2 transition-colors ${
              activeTab === "preferences"
                ? "border-brand text-brand"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            <span className="flex items-center gap-sm">
              <Settings className="h-4 w-4" aria-hidden="true" />
              Preferências
            </span>
          </button>
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-md">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-sm">
                    Nome de Usuário
                  </label>
                  <input
                    type="text"
                    value={user?.username || ""}
                    disabled
                    className="w-full h-input px-md rounded-lg border border-surface-stroke bg-surface-elevation text-text-secondary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-sm">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    className="w-full h-input px-md rounded-lg border border-surface-stroke bg-surface-bg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-sm">
                    Grupos
                  </label>
                  <input
                    type="text"
                    value={user?.groups?.join(", ") || ""}
                    disabled
                    className="w-full h-input px-md rounded-lg border border-surface-stroke bg-surface-elevation text-text-secondary"
                  />
                </div>
                <Button variant="primary">Salvar Alterações</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-md">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-sm">
                    Senha Atual
                  </label>
                  <input
                    type="password"
                    className="w-full h-input px-md rounded-lg border border-surface-stroke bg-surface-bg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-sm">
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    className="w-full h-input px-md rounded-lg border border-surface-stroke bg-surface-bg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-sm">
                    Confirmar Nova Senha
                  </label>
                  <input
                    type="password"
                    className="w-full h-input px-md rounded-lg border border-surface-stroke bg-surface-bg"
                  />
                </div>
                <Button variant="secondary">Alterar Senha</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <Card>
          <CardHeader>
            <CardTitle>Preferências de Notificação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notificações por Email</h4>
                  <p className="text-sm text-text-secondary">
                    Receber updates por email sobre seus atendimentos
                  </p>
                </div>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Alertas de Sistema</h4>
                  <p className="text-sm text-text-secondary">
                    Notificações sobre manutenção e atualizações
                  </p>
                </div>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Relatórios Semanais</h4>
                  <p className="text-sm text-text-secondary">
                    Resumo semanal da sua performance
                  </p>
                </div>
                <input type="checkbox" className="toggle" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preferences Tab */}
      {activeTab === "preferences" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
          <Card>
            <CardHeader>
              <CardTitle>Aparência</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-md">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-sm">
                    Tema
                  </label>
                  <select className="w-full h-input px-md rounded-lg border border-surface-stroke bg-surface-bg">
                    <option>Claro</option>
                    <option>Escuro</option>
                    <option>Automático</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-sm">
                    Idioma
                  </label>
                  <select className="w-full h-input px-md rounded-lg border border-surface-stroke bg-surface-bg">
                    <option>Português (Brasil)</option>
                    <option>English</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Funcionalidades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-md">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-sm">
                    Itens por Página
                  </label>
                  <select className="w-full h-input px-md rounded-lg border border-surface-stroke bg-surface-bg">
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                    <option>100</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Atualização Automática</h4>
                    <p className="text-sm text-text-secondary">
                      Recarregar dados automaticamente
                    </p>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

import { useMemo } from "react";
import { BarChart3, Headset, Settings } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function DashboardPage() {
  const { user, hasRole, hasAnyRole } = useAuth();
  const managementRoles = useMemo(() => ["superadmin", "admin", "supervisor", "gerente", "calculista"], []);

  // Redirect to specific dashboard based on user role
  if (hasRole("atendente")) {
    return <Navigate to="/dashboard/esteira" replace />;
  }

  if (hasAnyRole(managementRoles)) {
    return <Navigate to="/dashboard/admin" replace />;
  }

  // Default dashboard for users without specific roles
  return (
    <div className="space-y-xl">
      <div>
        <h1 className="heading-1 text-text-primary mb-md">
          Bem-vindo ao Lifecaller
        </h1>
        <p className="body-text text-text-secondary">
          Sistema de Gestão de Atendimentos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
        {/* User Info Card */}
        <div className="bg-surface-card border border-surface-stroke rounded-xl p-lg">
          <h3 className="heading-3 text-text-primary mb-md">Seu Perfil</h3>
          <div className="space-y-sm">
            <p className="text-sm">
              <span className="font-medium">Usuário:</span> {user?.username}
            </p>
            <p className="text-sm">
              <span className="font-medium">Email:</span> {user?.email}
            </p>
            <p className="text-sm">
              <span className="font-medium">Grupos:</span>{" "}
              {user?.groups?.join(", ") || "Nenhum"}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-surface-card border border-surface-stroke rounded-xl p-lg">
          <h3 className="heading-3 text-text-primary mb-md">Ações Rápidas</h3>
          <div className="space-y-sm">
            <button className="w-full text-left px-md py-sm rounded-lg hover:bg-surface-elevation transition-colors">
              <span className="flex items-center gap-sm">
                <BarChart3 className="h-4 w-4" aria-hidden="true" />
                Ver Relatórios
              </span>
            </button>
            <button className="w-full text-left px-md py-sm rounded-lg hover:bg-surface-elevation transition-colors">
              <span className="flex items-center gap-sm">
                <Settings className="h-4 w-4" aria-hidden="true" />
                Configurações
              </span>
            </button>
            <button className="w-full text-left px-md py-sm rounded-lg hover:bg-surface-elevation transition-colors">
              <span className="flex items-center gap-sm">
                <Headset className="h-4 w-4" aria-hidden="true" />
                Suporte
              </span>
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-surface-card border border-surface-stroke rounded-xl p-lg">
          <h3 className="heading-3 text-text-primary mb-md">Status do Sistema</h3>
          <div className="space-y-sm">
            <div className="flex items-center gap-sm">
              <div className="w-2 h-2 bg-feedback-success rounded-full"></div>
              <span className="text-sm">Sistema Online</span>
            </div>
            <div className="flex items-center gap-sm">
              <div className="w-2 h-2 bg-feedback-success rounded-full"></div>
              <span className="text-sm">API Funcionando</span>
            </div>
            <div className="flex items-center gap-sm">
              <div className="w-2 h-2 bg-feedback-success rounded-full"></div>
              <span className="text-sm">Banco de Dados OK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

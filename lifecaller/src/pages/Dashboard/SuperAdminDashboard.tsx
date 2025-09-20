import {
  AlertTriangle,
  Ban,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Cpu,
  Database,
  Download,
  FileText,
  History,
  Lock,
  RefreshCw,
  Server,
  Shield,
  ShieldAlert,
  Trash2,
  TrendingDown,
  TrendingUp,
  Users,
  UserPlus,
} from "lucide-react";
import { Fragment, type ComponentType, type SVGProps } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/design-system/components/Card";
import { Button } from "@/design-system/components/Button";
import { cn } from "@/lib/cn";

type SuperAdminAction = {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  path?: string;
  available?: boolean;
};

type SuperAdminSection = {
  title: string;
  actions: SuperAdminAction[];
};

const SUPER_SECTIONS: SuperAdminSection[] = [
  {
    title: "Gestão de Usuários",
    actions: [
      { label: "Criar Super Admin", icon: UserPlus, available: false },
      { label: "Gerenciar Administradores", icon: Users, path: "/dashboard/admin", available: true },
      { label: "Auditoria de Usuários", icon: FileText, available: false },
      { label: "Revogar Acessos", icon: Ban, available: false },
    ],
  },
  {
    title: "Sistema e Infraestrutura",
    actions: [
      { label: "Status dos Serviços", icon: Server, available: false },
      { label: "Logs do Sistema", icon: ClipboardList, available: false },
      { label: "Performance e Recursos", icon: Cpu, available: false },
      { label: "Reiniciar Serviços", icon: RefreshCw, available: false },
    ],
  },
  {
    title: "Backup e Recuperação",
    actions: [
      { label: "Backup Completo", icon: Download, available: false },
      { label: "Agendar Backups", icon: Calendar, available: false },
      { label: "Histórico de Backups", icon: History, available: false },
      { label: "Recuperação de Desastre", icon: AlertTriangle, available: false },
    ],
  },
  {
    title: "Segurança Avançada",
    actions: [
      { label: "Configurações de Firewall", icon: Shield, available: false },
      { label: "Monitorar Intrusões", icon: ShieldAlert, available: false },
      { label: "Certificados SSL", icon: Lock, available: false },
      { label: "Lockdown de Segurança", icon: Ban, available: false },
    ],
  },
  {
    title: "Banco de Dados",
    actions: [
      { label: "Console SQL", icon: Database, available: false },
      { label: "Otimização de Consultas", icon: Cpu, available: false },
      { label: "Migrações", icon: RefreshCw, available: false },
      { label: "Purgar Dados Antigos", icon: Trash2, available: false },
    ],
  },
  {
    title: "Analytics Global",
    actions: [
      { label: "Métricas de Uso", icon: TrendingUp, available: false },
      { label: "Relatório Executivo", icon: FileText, available: false },
      { label: "Tendências do Sistema", icon: TrendingDown, available: false },
      { label: "Previsões de Capacidade", icon: CheckCircle2, available: false },
    ],
  },
];

function SuperAdminActionButton({ action }: { action: SuperAdminAction }) {
  const navigate = useNavigate();
  const isAvailable = Boolean(action.available && action.path);
  const Icon = action.icon;
  const button = (
    <Button
      variant={isAvailable ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start gap-sm",
        !isAvailable && "opacity-60 cursor-not-allowed hover:opacity-60",
      )}
      onClick={() => {
        if (isAvailable && action.path) {
          navigate(action.path);
        }
      }}
      type="button"
      disabled={!isAvailable}
      aria-disabled={!isAvailable}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span>{action.label}</span>
    </Button>
  );

  if (isAvailable) {
    return button;
  }

  return (
    <span className="block w-full" title="Em desenvolvimento">
      {button}
    </span>
  );
}

export function SuperAdminDashboard() {
  return (
    <div className="space-y-xl">
      <div>
        <h1 className="heading-1 text-text-primary mb-md">
          Super Administrador
        </h1>
        <p className="body-text text-text-secondary">
          Controle total do sistema e configurações avançadas
        </p>
      </div>

      <div className="rounded-lg border border-red-300 bg-red-50 p-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
          <div>
            <h3 className="font-bold text-red-800">Acesso de Super Administrador</h3>
            <p className="text-sm text-red-600">
              Você tem acesso completo ao sistema. Use com cautela.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-lg md:grid-cols-2 lg:grid-cols-3">
        {SUPER_SECTIONS.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-md">
                {section.actions.map((action) => (
                  <Fragment key={action.label}>
                    <SuperAdminActionButton action={action} />
                  </Fragment>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Saúde do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-lg md:grid-cols-3">
            <div className="text-center">
              <div className="mb-sm text-3xl font-bold text-feedback-success">99.9%</div>
              <div className="text-sm text-text-secondary">Uptime</div>
            </div>
            <div className="text-center">
              <div className="mb-sm text-3xl font-bold text-feedback-info">45ms</div>
              <div className="text-sm text-text-secondary">Latência Média</div>
            </div>
            <div className="text-center">
              <div className="mb-sm text-3xl font-bold text-feedback-warning">2.1GB</div>
              <div className="text-sm text-text-secondary">Uso de Memória</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

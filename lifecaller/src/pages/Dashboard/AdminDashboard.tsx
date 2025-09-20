import React, { Fragment } from "react";
import {
  BarChart3,
  BrainCircuit,
  Building,
  Download,
  Gauge,
  HardDriveDownload,
  History,
  Mail,
  Network,
  Palette,
  PieChart,
  Presentation,
  ScrollText,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Target,
  TrendingUp,
  UserPlus,
  Users,
  Webhook,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/design-system/components/Card";
import { Button } from "@/design-system/components/Button";
import { cn } from "@/lib/cn";

type AdminAction = {
  label: string;
  icon: LucideIcon;
  path?: string;
  available?: boolean;
};

type AdminSection = {
  title: string;
  actions: AdminAction[];
};

const SECTIONS: AdminSection[] = [
  {
    title: "Gestão de Usuários",
    actions: [
      { label: "Adicionar Usuário", icon: UserPlus, available: false },
      { label: "Listar Usuários", icon: Users, available: false },
      { label: "Permissões", icon: ShieldCheck, available: false },
      { label: "Relatório de Acesso", icon: BarChart3, available: false },
    ],
  },
  {
    title: "Configurações do Sistema",
    actions: [
      { label: "Parâmetros Gerais", icon: Settings, path: "/dashboard/configuracoes", available: true },
      { label: "Metas e SLAs", icon: Target, available: false },
      { label: "Notificações", icon: Mail, path: "/dashboard/configuracoes?tab=notifications", available: true },
      { label: "Personalização", icon: Palette, path: "/dashboard/configuracoes?tab=preferences", available: true },
    ],
  },
  {
    title: "Monitoramento",
    actions: [
      { label: "Métricas de Sistema", icon: TrendingUp, available: false },
      { label: "Logs de Auditoria", icon: ScrollText, available: false },
      { label: "Performance", icon: Gauge, available: false },
      { label: "Dashboard Executivo", icon: Presentation, available: false },
    ],
  },
  {
    title: "Backup e Segurança",
    actions: [
      { label: "Backup Manual", icon: HardDriveDownload, available: false },
      { label: "Restaurar Backup", icon: History, available: false },
      { label: "Políticas de Senha", icon: ShieldCheck, path: "/dashboard/configuracoes?tab=preferences", available: true },
      { label: "Firewall e Logs", icon: ShieldAlert, available: false },
    ],
  },
  {
    title: "Integrações",
    actions: [
      { label: "APIs Bancárias", icon: Building, available: false },
      { label: "Webhook Configs", icon: Webhook, available: false },
      { label: "Email/SMS", icon: Mail, available: false },
      { label: "Sistemas Externos", icon: Network, available: false },
    ],
  },
  {
    title: "Relatórios e Analytics",
    actions: [
      { label: "Dashboard BI", icon: PieChart, available: false },
      { label: "Relatórios Customizados", icon: ScrollText, available: false },
      { label: "Exportar Dados", icon: Download, available: false },
      { label: "Análise Preditiva", icon: BrainCircuit, available: false },
    ],
  },
];

function AdminActionButton({ action }: { action: AdminAction }) {
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

export function AdminDashboard() {
  return (
    <div className="space-y-xl">
      <div>
        <h1 className="heading-1 text-text-primary mb-md">
          Painel Administrativo
        </h1>
        <p className="body-text text-text-secondary">
          Gerencie usuários, configurações e manutenção do sistema
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
        {SECTIONS.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-md">
                {section.actions.map((action) => (
                  <Fragment key={action.label}>
                    <AdminActionButton action={action} />
                  </Fragment>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

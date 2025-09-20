import { Wrench, BriefcaseBusiness, Users, PhoneCall, Calculator, Info, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/design-system/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/design-system/components/Card";

interface TestCredential {
  role: string;
  username: string;
  password: string;
  description: string;
  icon: LucideIcon;
}

const testCredentials: TestCredential[] = [
  {
    role: "Super Admin",
    username: "admin",
    password: "admin123",
    description: "Acesso total ao sistema",
    icon: Wrench
  },
  {
    role: "Gerente",
    username: "gerente1",
    password: "gerente123",
    description: "Dashboard de fechamento",
    icon: BriefcaseBusiness
  },
  {
    role: "Supervisor",
    username: "supervisor1",
    password: "supervisor123",
    description: "Dashboard de supervisão",
    icon: Users
  },
  {
    role: "Atendente 1",
    username: "atendente1",
    password: "atendente123",
    description: "Esteira de atendimento",
    icon: PhoneCall
  },
  {
    role: "Atendente 2",
    username: "atendente2",
    password: "atendente123",
    description: "Esteira de atendimento",
    icon: PhoneCall
  },
  {
    role: "Calculista",
    username: "calculista1",
    password: "calculista123",
    description: "Dashboard de cálculos",
    icon: Calculator
  }
];

interface TestCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCredential: (username: string, password: string) => void;
}

export function TestCredentialsModal({
  isOpen,
  onClose,
  onSelectCredential
}: TestCredentialsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-lg">
      <div className="bg-surface-card rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <Card variant="flat" className="border-0 shadow-none">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-sm">
                  <Wrench className="h-5 w-5 text-brand" aria-hidden="true" />
                  Credenciais de Teste
                </CardTitle>
                <p className="text-sm text-text-secondary mt-sm">
                  Selecione um usuário para login automático ou use as credenciais manualmente
                </p>
              </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
              {testCredentials.map((credential) => {
                const Icon = credential.icon;
                return (
                <Card
                  key={credential.username}
                  variant="interactive"
                  className="cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => onSelectCredential(credential.username, credential.password)}
                >
                  <CardContent className="text-center">
                    <div className="mb-md flex justify-center">
                      <Icon className="h-8 w-8 text-brand" aria-hidden="true" />
                    </div>
                    <h3 className="heading-3 text-text-primary mb-sm">
                      {credential.role}
                    </h3>
                    <div className="space-y-xs text-sm">
                      <div className="bg-surface-elevation rounded-md p-sm">
                        <div className="font-medium text-text-secondary">Usuário:</div>
                        <div className="font-mono text-brand">{credential.username}</div>
                      </div>
                      <div className="bg-surface-elevation rounded-md p-sm">
                        <div className="font-medium text-text-secondary">Senha:</div>
                        <div className="font-mono text-brand">{credential.password}</div>
                      </div>
                    </div>
                    <p className="text-xs text-text-muted mt-md">
                      {credential.description}
                    </p>
                    <Button
                      size="sm"
                      variant="primary"
                      className="mt-md w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCredential(credential.username, credential.password);
                      }}
                    >
                      Login como {credential.role}
                    </Button>
                  </CardContent>
                </Card>
                );
              })}
            </div>

            <div className="mt-xl border-t border-surface-stroke pt-lg">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-md">
                <h4 className="font-medium text-blue-800 mb-sm flex items-center gap-sm">
                  <Info className="h-4 w-4" aria-hidden="true" />
                  Informações Importantes
                </h4>
                <ul className="text-sm text-blue-700 space-y-xs">
                  <li>• Este modal é apenas para testes e desenvolvimento</li>
                  <li>• Cada usuário tem acesso a dashboards específicos</li>
                  <li>• Os dados são mockados e foram criados automaticamente</li>
                  <li>• Você pode fazer login manualmente ou clicar em um card acima</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end gap-md mt-lg">
              <Button
                variant="secondary"
                onClick={onClose}
              >
                Fechar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

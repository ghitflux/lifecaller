import React from "react";
import { AlertTriangle, BarChart3, CheckCircle2, Shuffle, Target, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/design-system/components/Card";
import { Button } from "@/design-system/components/Button";

export function SupervisorDashboard() {
  return (
    <div className="space-y-xl">
      <div>
        <h1 className="heading-1 text-text-primary mb-md">
          Dashboard de Supervisão
        </h1>
        <p className="body-text text-text-secondary">
          Monitore toda a operação e gerencie a equipe
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <Card>
          <CardHeader>
            <CardTitle>Visão Geral das Filas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-md">
              <div className="flex justify-between items-center">
                <span>Esteira Global</span>
                <span className="font-bold text-feedback-info">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Em Atendimento</span>
                <span className="font-bold text-feedback-warning">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Calculista</span>
                <span className="font-bold text-feedback-warning">5</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Fechamento</span>
                <span className="font-bold text-feedback-success">3</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance da Equipe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-md">
              <Button variant="secondary" className="w-full">
                <Users className="mr-2 h-4 w-4" aria-hidden="true" />
                Gerenciar Atendentes
              </Button>
              <Button variant="secondary" className="w-full">
                <BarChart3 className="mr-2 h-4 w-4" aria-hidden="true" />
                Relatórios Individuais
              </Button>
              <Button variant="secondary" className="w-full">
                <Target className="mr-2 h-4 w-4" aria-hidden="true" />
                Definir Metas
              </Button>
              <Button variant="secondary" className="w-full">
                <Shuffle className="mr-2 h-4 w-4" aria-hidden="true" />
                Reatribuir Casos
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertas e Notificações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-md">
              <div className="p-md bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-medium flex items-center gap-sm">
                  <AlertTriangle className="h-4 w-4 text-feedback-warning" aria-hidden="true" />
                  SLA em risco
                </p>
                <p className="text-xs text-text-secondary">3 processos próximos do limite</p>
              </div>
              <div className="p-md bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium flex items-center gap-sm">
                  <CheckCircle2 className="h-4 w-4 text-feedback-success" aria-hidden="true" />
                  Meta alcançada
                </p>
                <p className="text-xs text-text-secondary">Equipe atingiu 105% da meta</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

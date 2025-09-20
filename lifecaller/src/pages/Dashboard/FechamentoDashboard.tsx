import React, { useState, useEffect } from "react";
import { AlertTriangle, BarChart3, CheckCircle2, ClipboardList, FileSpreadsheet, Presentation, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/design-system/components/Card";
import { Button } from "@/design-system/components/Button";
import { http } from "@/services/http";

interface MetricData {
  total_atendimentos: number;
  aprovados: number;
  reprovados: number;
  pendentes: number;
  volume_total: number;
}

export function FechamentoDashboard() {
  const [metrics, setMetrics] = useState<MetricData>({
    total_atendimentos: 0,
    aprovados: 0,
    reprovados: 0,
    pendentes: 0,
    volume_total: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await http.get("/atendimentos/");
      const atendimentos = response.data.results || response.data;
      
      const aprovados = atendimentos.filter((a: any) => a.stage === "gerente_fechamento").length;
      const reprovados = atendimentos.filter((a: any) => a.stage === "reprovado").length;
      const pendentes = atendimentos.filter((a: any) => a.stage === "calculista").length;
      const volume = atendimentos.reduce((sum: number, a: any) => sum + (a.valor_liberado || 0), 0);
      
      setMetrics({
        total_atendimentos: atendimentos.length,
        aprovados,
        reprovados,
        pendentes,
        volume_total: volume
      });
    } catch (err) {
      console.error("Erro ao buscar métricas:", err);
    } finally {
      setLoading(false);
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
          Dashboard de Fechamento
        </h1>
        <p className="body-text text-text-secondary">
          Acompanhe métricas e aprove processos finais
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
        <Card>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand mb-sm">
                {metrics.total_atendimentos}
              </div>
              <div className="text-sm text-text-secondary">
                Total Geral
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-feedback-success mb-sm">
                {metrics.aprovados}
              </div>
              <div className="text-sm text-text-secondary">
                Aprovados
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-feedback-warning mb-sm">
                {metrics.pendentes}
              </div>
              <div className="text-sm text-text-secondary">
                Pendentes
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold text-feedback-info mb-sm">
                {metrics.volume_total.toLocaleString('pt-BR', {
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

      {/* Actions Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-md">
              <Button variant="primary" className="w-full">
                <FileSpreadsheet className="mr-2 h-4 w-4" aria-hidden="true" />
                Gerar Relatório Diário
              </Button>
              <Button variant="secondary" className="w-full">
                <BarChart3 className="mr-2 h-4 w-4" aria-hidden="true" />
                Exportar Métricas
              </Button>
              <Button variant="secondary" className="w-full">
                <ClipboardList className="mr-2 h-4 w-4" aria-hidden="true" />
                Revisar Pendências
              </Button>
              <Button variant="secondary" className="w-full">
                <Settings className="mr-2 h-4 w-4" aria-hidden="true" />
                Configurações de Meta
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status da Equipe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-md">
              <div className="flex items-center justify-between p-md bg-surface-elevation rounded-lg">
                <span>Atendentes Online</span>
                <span className="font-bold text-feedback-success">8/10</span>
              </div>
              <div className="flex items-center justify-between p-md bg-surface-elevation rounded-lg">
                <span>Calculistas Ativos</span>
                <span className="font-bold text-feedback-success">3/3</span>
              </div>
              <div className="flex items-center justify-between p-md bg-surface-elevation rounded-lg">
                <span>Processos em Atraso</span>
                <span className="font-bold text-feedback-warning">2</span>
              </div>
              <div className="flex items-center justify-between p-md bg-surface-elevation rounded-lg">
                <span>Meta do Dia</span>
                <span className="font-bold text-brand">75%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-md">
            <div className="flex items-center gap-md p-md border-l-4 border-feedback-success bg-green-50">
              <CheckCircle2 className="h-5 w-5 text-feedback-success" aria-hidden="true" />
              <div>
                <p className="font-medium">Processo #1234 aprovado</p>
                <p className="text-sm text-text-secondary">há 5 minutos - por João Silva</p>
              </div>
            </div>
            <div className="flex items-center gap-md p-md border-l-4 border-feedback-info bg-blue-50">
              <Presentation className="h-5 w-5 text-feedback-info" aria-hidden="true" />
              <div>
                <p className="font-medium">Relatório mensal gerado</p>
                <p className="text-sm text-text-secondary">há 1 hora - Sistema</p>
              </div>
            </div>
            <div className="flex items-center gap-md p-md border-l-4 border-feedback-warning bg-yellow-50">
              <AlertTriangle className="h-5 w-5 text-feedback-warning" aria-hidden="true" />
              <div>
                <p className="font-medium">Meta diária em 90%</p>
                <p className="text-sm text-text-secondary">há 2 horas - Sistema</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import React from "react";
import { CircleSlash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/design-system/components/Button";

export function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-surface-bg flex items-center justify-center p-lg">
      <div className="text-center max-w-md">
        <div className="mb-lg flex justify-center">
          <CircleSlash2 className="h-16 w-16 text-feedback-danger" aria-hidden="true" />
        </div>
        <h1 className="heading-1 text-text-primary mb-md">Acesso Negado</h1>
        <p className="body-text text-text-secondary mb-xl">
          Você não tem permissão para acessar esta página.
          Entre em contato com o administrador se acredita que isso é um erro.
        </p>
        <div className="space-y-md">
          <Link to="/dashboard">
            <Button variant="primary" size="lg" className="w-full">
              Voltar ao Início
            </Button>
          </Link>
          <Link to="/configuracoes">
            <Button variant="secondary" size="lg" className="w-full">
              Configurações
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

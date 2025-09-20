import React from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/design-system/components/Button";

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-surface-bg flex items-center justify-center p-lg">
      <div className="text-center max-w-md">
        <div className="mb-lg flex justify-center">
          <Search className="h-16 w-16 text-text-secondary" aria-hidden="true" />
        </div>
        <h1 className="heading-1 text-text-primary mb-md">404 - Página Não Encontrada</h1>
        <p className="body-text text-text-secondary mb-xl">
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="space-y-md">
          <Link to="/dashboard">
            <Button variant="primary" size="lg" className="w-full">
              Voltar ao Início
            </Button>
          </Link>
          <Link to="/">
            <Button variant="secondary" size="lg" className="w-full">
              Página Principal
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

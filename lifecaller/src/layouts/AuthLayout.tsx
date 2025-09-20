import React from "react";
import { Outlet } from "react-router-dom";

interface AuthLayoutProps {
  children?: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-surface-bg flex items-center justify-center p-md">
      <div className="w-full max-w-md">
        <div className="text-center mb-xl">
          <h1 className="heading-1 text-brand mb-md">Lifecaller</h1>
          <p className="caption-text text-text-secondary">
            Sistema de Gestão de Atendimentos
          </p>
        </div>

        <div className="bg-surface-card border border-surface-stroke rounded-xl shadow-md p-xl">
          {children || <Outlet />}
        </div>

        <div className="text-center mt-lg">
          <p className="caption-text text-text-muted">
            © 2024 Lifecaller. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { KeyRound } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/design-system/components/Button";
import { Card, CardContent } from "@/design-system/components/Card";
import { TestCredentialsModal } from "@/components/TestCredentialsModal";

export function LoginPage() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(credentials);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
        err?.message ||
        "Erro ao fazer login. Verifique suas credenciais."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectCredential = (username: string, password: string) => {
    setCredentials({ username, password });
    setShowCredentialsModal(false);
    // Auto-submit after selecting credentials
    setTimeout(() => {
      const form = document.getElementById('loginForm') as HTMLFormElement;
      if (form) {
        form.requestSubmit();
      }
    }, 100);
  };

  return (
    <>
      <form id="loginForm" onSubmit={handleSubmit} className="space-y-lg">
        <div className="text-center mb-xl">
          <h2 className="heading-2 text-text-primary mb-sm">Entrar</h2>
          <p className="caption-text text-text-secondary">
            Digite suas credenciais para acessar o sistema
          </p>
        </div>

      {error && (
        <Card variant="flat" className="border-feedback-danger bg-red-50">
          <CardContent className="p-md">
            <p className="text-sm text-feedback-danger">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-md">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-text-primary mb-sm"
          >
            Usuário
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={credentials.username}
            onChange={handleChange}
            className="
              w-full h-input px-md rounded-lg border border-surface-stroke
              bg-surface-bg text-text-primary placeholder-text-muted
              focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-normal
            "
            placeholder="Digite seu usuário"
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-text-primary mb-sm"
          >
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={credentials.password}
            onChange={handleChange}
            className="
              w-full h-input px-md rounded-lg border border-surface-stroke
              bg-surface-bg text-text-primary placeholder-text-muted
              focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-normal
            "
            placeholder="Digite sua senha"
            disabled={loading}
          />
        </div>
      </div>

      <div className="pt-md">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full"
        >
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </div>

        <div className="flex items-center justify-center gap-md pt-md">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowCredentialsModal(true)}
          className="text-brand hover:text-brand"
        >
          <span className="flex items-center gap-sm">
            <KeyRound className="h-4 w-4" aria-hidden="true" />
            Ver Credenciais de Teste
          </span>
        </Button>
        </div>

        <div className="text-center pt-md">
          <p className="caption-text text-text-muted">
            Problemas para acessar? Entre em contato com o administrador.
          </p>
        </div>
      </form>

      <TestCredentialsModal
        isOpen={showCredentialsModal}
        onClose={() => setShowCredentialsModal(false)}
        onSelectCredential={handleSelectCredential}
      />
    </>
  );
}

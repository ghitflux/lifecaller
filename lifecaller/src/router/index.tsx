import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute, PublicRoute } from "./ProtectedRoute";
import { MainLayout } from "@/layouts/MainLayout";
import { AuthLayout } from "@/layouts/AuthLayout";

// Import pages
import { LoginPage } from "@/pages/Login";
import { DashboardPage } from "@/pages/Dashboard";
import { EsteiraDashboard } from "@/pages/Dashboard/EsteiraDashboard";
import { CalculistaDashboard } from "@/pages/Dashboard/CalculistaDashboard";
import { FechamentoDashboard } from "@/pages/Dashboard/FechamentoDashboard";
import { SupervisorDashboard } from "@/pages/Dashboard/SupervisorDashboard";
import { AdminDashboard } from "@/pages/Dashboard/AdminDashboard";
import { SuperAdminDashboard } from "@/pages/Dashboard/SuperAdminDashboard";
import { ConfiguracoesPage } from "@/pages/Configuracoes";
import { UnauthorizedPage } from "@/pages/Unauthorized";
import { NotFoundPage } from "@/pages/NotFound";

const managementRoles = ["superadmin", "admin", "supervisor", "gerente", "calculista"] as const;

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PublicRoute>
        <AuthLayout>
          <LoginPage />
        </AuthLayout>
      </PublicRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "esteira",
        element: (
          <ProtectedRoute roles={["atendente", ...managementRoles]}>
            <EsteiraDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "calculista",
        element: (
          <ProtectedRoute roles={[...managementRoles]}>
            <CalculistaDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "fechamento",
        element: (
          <ProtectedRoute roles={[...managementRoles]}>
            <FechamentoDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "supervisor",
        element: (
          <ProtectedRoute roles={[...managementRoles]}>
            <SupervisorDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute roles={[...managementRoles]}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "superadmin",
        element: (
          <ProtectedRoute roles={["superadmin"]}>
            <SuperAdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "configuracoes",
        element: <ConfiguracoesPage />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <AuthLayout>
          <LoginPage />
        </AuthLayout>
      </PublicRoute>
    ),
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

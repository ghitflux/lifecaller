import { LayoutDashboard, Phone, Calculator, CheckCircle2, Users, Settings, Wrench, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/design-system/components/Button";

interface NavItem {
  path: string;
  label: string;
  roles?: string[];
  icon: LucideIcon;
}

const managementRoles = ["superadmin", "admin", "supervisor", "gerente", "calculista"] as const;

const navItems: NavItem[] = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    path: "/dashboard/esteira",
    label: "Esteira de Atendimento",
    roles: ["atendente", ...managementRoles],
    icon: Phone,
  },
  {
    path: "/dashboard/calculista",
    label: "Calculista",
    roles: [...managementRoles],
    icon: Calculator,
  },
  {
    path: "/dashboard/fechamento",
    label: "Fechamento",
    roles: [...managementRoles],
    icon: CheckCircle2,
  },
  {
    path: "/dashboard/supervisor",
    label: "Supervisão",
    roles: [...managementRoles],
    icon: Users,
  },
  {
    path: "/dashboard/admin",
    label: "Administração",
    roles: [...managementRoles],
    icon: Settings,
  },
  {
    path: "/dashboard/superadmin",
    label: "Super Admin",
    roles: ["superadmin"],
    icon: Wrench,
  },
  {
    path: "/dashboard/configuracoes",
    label: "Configurações",
    icon: SlidersHorizontal,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ isOpen, onClose, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const { user, hasAnyRole, logout } = useAuth();
  const location = useLocation();

  const filteredNavItems = navItems.filter(item =>
    !item.roles || hasAnyRole(item.roles)
  );

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-surface-card border-r border-surface-stroke z-50
          transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "w-18" : "w-64"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`border-b border-surface-stroke ${isCollapsed ? "p-1" : "p-lg"}`}>
            <div className="flex items-center justify-between">
              {!isCollapsed && <h2 className="heading-3 text-brand">Lifecaller</h2>}
              
              <div className="flex items-center gap-2">
                {/* Collapse toggle - only on desktop */}
                {onToggleCollapse && (
                  <button
                    onClick={onToggleCollapse}
                    className="hidden lg:flex p-2 hover:bg-surface-elevation rounded-lg transition-colors"
                    title={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
                  >
                    {isCollapsed ? (
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                )}
                
                {/* Close button - only on mobile */}
                <button
                  onClick={onClose}
                  className="lg:hidden p-2 hover:bg-surface-elevation rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className={`flex-1 overflow-y-auto space-y-sm ${isCollapsed ? "px-2 py-lg" : "p-lg"}`}>
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.path;

              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`
                    flex items-center rounded-lg text-sm transition-colors
                    ${isCollapsed ? "justify-center p-3 mx-auto w-12 h-12" : "gap-3 px-md py-sm"}
                    ${isActive
                      ? "bg-brand text-text-inverse font-medium"
                      : "text-text-primary hover:bg-surface-elevation"
                    }
                  `}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={`${isCollapsed ? "h-4 w-4" : "h-5 w-5"}`} aria-hidden="true" />
                  {!isCollapsed && item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className={`border-t border-surface-stroke ${isCollapsed ? "p-2" : "p-lg"}`}>
            {!isCollapsed && (
              <div className="mb-md">
                <p className="text-sm font-medium text-text-primary">
                  {user?.username}
                </p>
                <p className="text-xs text-text-secondary">
                  {user?.groups?.join(", ")}
                </p>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className={isCollapsed ? "w-full p-2 flex justify-center" : "w-full"}
              title={isCollapsed ? "Sair" : undefined}
            >
              {isCollapsed ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              ) : (
                "Sair"
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

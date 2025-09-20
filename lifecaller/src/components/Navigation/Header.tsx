import React from "react";
import { Menu, Moon, Sun, Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/design-system/components/Button";
import { Avatar } from "@/design-system/components/Avatar";
import { useTheme } from "@/providers/ThemeProvider";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <header className="bg-surface-card border-b border-surface-stroke h-16 flex items-center justify-between px-lg">
      {/* Left side */}
      <div className="flex items-center gap-md">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>

        <div className="hidden lg:block">
          <h1 className="heading-3 text-text-primary">
            Bem-vindo, {user?.username}
          </h1>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-md">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          aria-label="Alternar tema"
        >
          {resolvedTheme === "dark" ? (
            <Moon className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Sun className="h-5 w-5" aria-hidden="true" />
          )}
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="sm">
          <Bell className="h-5 w-5" aria-hidden="true" />
        </Button>

        {/* User Menu */}
        <div className="flex items-center gap-sm">
          <Avatar
            name={user?.username || "User"}
            size="sm"
          />
          <div className="hidden md:block">
            <p className="text-sm font-medium text-text-primary">
              {user?.username}
            </p>
            <p className="text-xs text-text-secondary">
              {user?.groups?.[0] || "Usuário"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

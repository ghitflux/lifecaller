import { http } from "./http";

export interface User {
  id: number;
  username: string;
  email: string;
  groups: string[];
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await http.post("/auth/token/", credentials);
    const tokens = response.data;

    localStorage.setItem("token", tokens.access);
    localStorage.setItem("refreshToken", tokens.refresh);

    return tokens;
  }

  static async logout(): Promise<void> {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  static async getCurrentUser(): Promise<User> {
    const response = await http.get("/me/");
    const user = response.data;
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  }

  static async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await http.post("/auth/refresh/", {
      refresh: refreshToken,
    });

    const { access } = response.data;
    localStorage.setItem("token", access);
    return access;
  }

  static getStoredUser(): User | null {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  static getStoredToken(): string | null {
    return localStorage.getItem("token");
  }

  static isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }

  static hasRole(user: User | null, role: string): boolean {
    return user?.groups?.includes(role) ?? false;
  }

  static hasAnyRole(user: User | null, roles: string[]): boolean {
    return roles.some(role => this.hasRole(user, role));
  }
}

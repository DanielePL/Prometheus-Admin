import { createContext, useContext, useState, type ReactNode } from "react";
import type { User, UserRole } from "@/api/types/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSalesUser: boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  login: (email: string, userId: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Auth disabled - always authenticated as admin
  const [user] = useState<User | null>({
    id: "admin",
    email: "admin@prometheus.coach",
    role: "admin",
    name: "Admin",
  });
  const [token] = useState<string | null>("prometheus_admin_2024");
  const [isLoading] = useState(false);

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roles = Array.isArray(role) ? role : [role];
    // Admin has access to everything
    if (user.role === "admin") return true;
    return roles.includes(user.role);
  };

  const login = async () => {
    // Auth disabled - do nothing
  };

  const logout = async () => {
    // Auth disabled - do nothing
  };

  const isAdmin = user?.role === "admin";
  const isSalesUser = user?.role === "sales" || user?.role === "partner" || isAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        isAdmin,
        isSalesUser,
        hasRole,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

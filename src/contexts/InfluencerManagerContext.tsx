import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import {
  getIMToken,
  getIMUser,
  setIMAuth,
  clearIMAuth,
  isIMAuthenticated,
  influencerManagerApi,
  type InfluencerManagerUser,
} from "@/api/influencerManagerClient";

interface InfluencerManagerContextType {
  user: InfluencerManagerUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const InfluencerManagerContext = createContext<InfluencerManagerContextType | undefined>(undefined);

export function InfluencerManagerProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<InfluencerManagerUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing auth on mount
  useEffect(() => {
    if (isIMAuthenticated()) {
      setToken(getIMToken());
      setUser(getIMUser());
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await influencerManagerApi.post("/auth/login", {
      email,
      password,
    });

    const { token: newToken, user: newUser } = response.data;
    setIMAuth(newToken, newUser);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    clearIMAuth();
    setToken(null);
    setUser(null);
  };

  return (
    <InfluencerManagerContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        logout,
      }}
    >
      {children}
    </InfluencerManagerContext.Provider>
  );
}

export function useInfluencerManager() {
  const context = useContext(InfluencerManagerContext);
  if (context === undefined) {
    throw new Error("useInfluencerManager must be used within an InfluencerManagerProvider");
  }
  return context;
}

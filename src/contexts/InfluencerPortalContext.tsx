import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import {
  getInfluencerToken,
  getInfluencerData,
  setInfluencerAuth,
  clearInfluencerAuth,
  isInfluencerAuthenticated,
  influencerPortalApi,
  type InfluencerPortalUser,
} from "@/api/influencerClient";

interface InfluencerPortalContextType {
  influencer: InfluencerPortalUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, code: string) => Promise<void>;
  logout: () => void;
}

const InfluencerPortalContext = createContext<InfluencerPortalContextType | undefined>(undefined);

export function InfluencerPortalProvider({ children }: { children: ReactNode }) {
  const [influencer, setInfluencer] = useState<InfluencerPortalUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing auth on mount
  useEffect(() => {
    if (isInfluencerAuthenticated()) {
      setToken(getInfluencerToken());
      setInfluencer(getInfluencerData());
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, code: string) => {
    const response = await influencerPortalApi.post("/auth/login", {
      email,
      code,
    });

    const { token: newToken, influencer: influencerData } = response.data;
    setInfluencerAuth(newToken, influencerData);
    setToken(newToken);
    setInfluencer(influencerData);
  };

  const logout = () => {
    clearInfluencerAuth();
    setToken(null);
    setInfluencer(null);
  };

  return (
    <InfluencerPortalContext.Provider
      value={{
        influencer,
        token,
        isLoading,
        isAuthenticated: !!token && !!influencer,
        login,
        logout,
      }}
    >
      {children}
    </InfluencerPortalContext.Provider>
  );
}

export function useInfluencerPortal() {
  const context = useContext(InfluencerPortalContext);
  if (context === undefined) {
    throw new Error("useInfluencerPortal must be used within an InfluencerPortalProvider");
  }
  return context;
}

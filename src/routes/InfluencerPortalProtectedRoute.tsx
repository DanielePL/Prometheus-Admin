import { Navigate } from "react-router-dom";
import { useInfluencerPortal } from "@/contexts/InfluencerPortalContext";

interface InfluencerPortalProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protected route for Influencer Personal Portal.
 * Only authenticated influencers can access.
 */
export function InfluencerPortalProtectedRoute({
  children,
}: InfluencerPortalProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useInfluencerPortal();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/influencer/login" replace />;
  }

  return <>{children}</>;
}

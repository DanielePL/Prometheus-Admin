import { Navigate } from "react-router-dom";
import { useInfluencerManager } from "@/contexts/InfluencerManagerContext";
import { useAuth } from "@/contexts/AuthContext";

interface InfluencerManagerProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protected route for Influencer Manager pages.
 * Allows access if:
 * 1. User is admin/sales (via main auth) - full access
 * 2. User is authenticated as Influencer Manager - limited access
 */
export function InfluencerManagerProtectedRoute({
  children,
}: InfluencerManagerProtectedRouteProps) {
  const { canAccessInfluencers } = useAuth();
  const { isAuthenticated: isIMAuthenticated, isLoading } = useInfluencerManager();

  // Admin/Sales users have direct access without additional login
  if (canAccessInfluencers) {
    return <>{children}</>;
  }

  // Loading state for IM auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Check IM authentication
  if (!isIMAuthenticated) {
    return <Navigate to="/influencers/login" replace />;
  }

  return <>{children}</>;
}

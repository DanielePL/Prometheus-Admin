import { Navigate } from "react-router-dom";
import { isPartnerAuthenticated } from "@/api/partnerClient";

interface PartnerProtectedRouteProps {
  children: React.ReactNode;
}

export function PartnerProtectedRoute({ children }: PartnerProtectedRouteProps) {
  if (!isPartnerAuthenticated()) {
    return <Navigate to="/partner/login" replace />;
  }

  return <>{children}</>;
}

import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "./ProtectedRoute";
import { PartnerProtectedRoute } from "./PartnerProtectedRoute";
import { PartnerLayout } from "@/components/partner-portal/PartnerLayout";

// Admin Pages
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { CostsOverviewPage } from "@/pages/costs/CostsOverviewPage";
import { FixedCostsPage } from "@/pages/costs/FixedCostsPage";
import { RevenueOverviewPage } from "@/pages/revenue/RevenueOverviewPage";
import { BreakEvenPage } from "@/pages/analytics/BreakEvenPage";
import { PartnersListPage } from "@/pages/partners/PartnersListPage";
import { PartnerDetailPage } from "@/pages/partners/PartnerDetailPage";
import { PayoutsPage } from "@/pages/partners/PayoutsPage";
import { EmployeesPage } from "@/pages/employees/EmployeesPage";
import { UsersListPage } from "@/pages/users/UsersListPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { SalesDemoPage } from "@/pages/sales/SalesDemoPage";
import { SalesCRMPage } from "@/pages/sales/SalesCRMPage";
import InfluencersPage from "@/pages/influencers/InfluencersPage";

// Partner Portal Pages
import PartnerLogin from "@/pages/partner-portal/PartnerLogin";
import PartnerDashboard from "@/pages/partner-portal/PartnerDashboard";
import ReferralsPage from "@/pages/partner-portal/ReferralsPage";
import PartnerPayoutsPage from "@/pages/partner-portal/PayoutsPage";
import PartnerSettings from "@/pages/partner-portal/PartnerSettings";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Navigate to="/" replace />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },

      // Costs
      { path: "costs", element: <CostsOverviewPage /> },
      { path: "costs/fixed", element: <FixedCostsPage /> },
      { path: "costs/services", element: <CostsOverviewPage /> },
      { path: "costs/users", element: <CostsOverviewPage /> },

      // Revenue
      { path: "revenue", element: <RevenueOverviewPage /> },

      // Analytics
      { path: "analytics/break-even", element: <BreakEvenPage /> },
      { path: "analytics/trends", element: <DashboardPage /> },

      // Partners
      { path: "partners", element: <PartnersListPage /> },
      { path: "partners/:id", element: <PartnerDetailPage /> },
      { path: "payouts", element: <PayoutsPage /> },

      // Employees
      { path: "employees", element: <EmployeesPage /> },

      // Users
      { path: "users", element: <UsersListPage /> },

      // Settings
      { path: "settings/notifications", element: <DashboardPage /> },

      // Sales
      { path: "sales/demo", element: <SalesDemoPage /> },
      { path: "sales/crm", element: <SalesCRMPage /> },

      // Influencers
      { path: "influencers", element: <InfluencersPage /> },
    ],
  },

  // Partner Portal Routes
  {
    path: "/partner/login",
    element: <PartnerLogin />,
  },
  {
    path: "/partner",
    element: (
      <PartnerProtectedRoute>
        <PartnerLayout />
      </PartnerProtectedRoute>
    ),
    children: [
      { index: true, element: <PartnerDashboard /> },
      { path: "referrals", element: <ReferralsPage /> },
      { path: "payouts", element: <PartnerPayoutsPage /> },
      { path: "settings", element: <PartnerSettings /> },
    ],
  },

  { path: "*", element: <NotFoundPage /> },
]);

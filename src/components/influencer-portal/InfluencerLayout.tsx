import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Flame,
  LayoutDashboard,
  Megaphone,
  DollarSign,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInfluencerPortal } from "@/contexts/InfluencerPortalContext";

const navigation = [
  { label: "Dashboard", href: "/influencer", icon: LayoutDashboard },
  { label: "Campaigns", href: "/influencer/campaigns", icon: Megaphone },
  { label: "Earnings", href: "/influencer/earnings", icon: DollarSign },
  { label: "Settings", href: "/influencer/settings", icon: Settings },
];

export function InfluencerLayout() {
  const navigate = useNavigate();
  const { influencer, logout } = useInfluencerPortal();

  const handleLogout = () => {
    logout();
    navigate("/influencer/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary glow-orange">
              <Flame className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">Creator Portal</span>
          </div>

          <div className="flex items-center gap-4">
            {influencer && (
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  @{influencer.instagram_handle}
                </span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="fixed top-16 left-0 right-0 z-40 bg-background/80 backdrop-blur border-b border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.href === "/influencer"}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-8">
        <div className="container mx-auto px-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

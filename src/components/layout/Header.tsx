import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Moon, Sun, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { OrganizationSwitcher } from "@/components/organization/OrganizationSwitcher";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, signOut, userProfile, organizations } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between glass px-4 md:px-6">
      {/* Left side - Menu button (mobile) + Organization Switcher */}
      <div className="flex items-center gap-3">
        {/* Hamburger menu - only visible on mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>

        {organizations.length > 1 && <OrganizationSwitcher />}
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* User Info */}
        {user && (
          <div className="flex items-center gap-2 md:gap-3">
            {/* Hide user details on very small screens */}
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{userProfile?.full_name || user.email}</p>
              <p className="text-xs text-muted-foreground hidden md:block">{user.email}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={signOut} title="Logout">
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

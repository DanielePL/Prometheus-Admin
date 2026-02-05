import { useState } from "react";
import { toast } from "sonner";
import {
  Bell,
  Mail,
  Smartphone,
  Users,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  UserPlus,
  FileText,
  Shield,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  email: boolean;
  push: boolean;
  category: "creators" | "finance" | "system" | "security";
}

const defaultSettings: NotificationSetting[] = [
  // Creators
  {
    id: "new_creator",
    label: "New Creator Sign-up",
    description: "When a new creator registers and needs approval",
    icon: UserPlus,
    email: true,
    push: true,
    category: "creators",
  },
  {
    id: "creator_inactive",
    label: "Inactive Creator Alert",
    description: "When a creator has no referrals for 14+ days",
    icon: AlertTriangle,
    email: true,
    push: false,
    category: "creators",
  },
  {
    id: "creator_milestone",
    label: "Creator Milestone",
    description: "When a creator reaches a referral milestone",
    icon: TrendingUp,
    email: false,
    push: true,
    category: "creators",
  },
  {
    id: "contract_expiring",
    label: "Contract Expiring",
    description: "When a creator contract is about to expire",
    icon: FileText,
    email: true,
    push: true,
    category: "creators",
  },

  // Finance
  {
    id: "payout_request",
    label: "Payout Request",
    description: "When a creator requests a payout",
    icon: DollarSign,
    email: true,
    push: true,
    category: "finance",
  },
  {
    id: "payout_threshold",
    label: "Payout Threshold Reached",
    description: "When pending payouts exceed a threshold",
    icon: DollarSign,
    email: true,
    push: false,
    category: "finance",
  },
  {
    id: "revenue_milestone",
    label: "Revenue Milestone",
    description: "When monthly revenue reaches a milestone",
    icon: TrendingUp,
    email: false,
    push: true,
    category: "finance",
  },

  // System
  {
    id: "new_user",
    label: "New App User",
    description: "When a new user signs up for the app",
    icon: Users,
    email: false,
    push: false,
    category: "system",
  },
  {
    id: "beta_feedback",
    label: "Beta Tester Feedback",
    description: "When a beta tester submits feedback",
    icon: Users,
    email: true,
    push: true,
    category: "system",
  },
  {
    id: "crash_spike",
    label: "Crash Spike Alert",
    description: "When crash rate exceeds normal levels",
    icon: AlertTriangle,
    email: true,
    push: true,
    category: "system",
  },

  // Security
  {
    id: "login_failed",
    label: "Failed Login Attempts",
    description: "When multiple failed login attempts are detected",
    icon: Shield,
    email: true,
    push: true,
    category: "security",
  },
  {
    id: "new_device",
    label: "New Device Login",
    description: "When someone logs in from a new device",
    icon: Smartphone,
    email: true,
    push: false,
    category: "security",
  },
];

const categories = [
  { id: "creators", label: "Creators & Partners", icon: Users },
  { id: "finance", label: "Finance & Payouts", icon: DollarSign },
  { id: "system", label: "System & App", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
] as const;

export function NotificationsPage() {
  const [settings, setSettings] = useState<NotificationSetting[]>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);

  const toggleSetting = (id: string, type: "email" | "push") => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id ? { ...setting, [type]: !setting[type] } : setting
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate saving to backend
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real app, you would save to Supabase here:
    // await supabase.from('notification_settings').upsert(settings)

    toast.success("Notification settings saved");
    setIsSaving(false);
  };

  const enableAll = (category: string) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.category === category
          ? { ...setting, email: true, push: true }
          : setting
      )
    );
  };

  const disableAll = (category: string) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.category === category
          ? { ...setting, email: false, push: false }
          : setting
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">Notifications</h1>
          <p className="text-muted-foreground text-lg">
            Manage how you receive notifications
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-xl glow-orange"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Legend */}
      <div className="glass rounded-2xl p-4 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Email</span>
        </div>
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Push Notification</span>
        </div>
      </div>

      {/* Settings by Category */}
      {categories.map((category) => {
        const categorySettings = settings.filter(
          (s) => s.category === category.id
        );
        const Icon = category.icon;

        return (
          <div key={category.id} className="glass rounded-2xl p-6">
            {/* Category Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold">{category.label}</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => enableAll(category.id)}
                >
                  Enable All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => disableAll(category.id)}
                >
                  Disable All
                </Button>
              </div>
            </div>

            {/* Settings List */}
            <div className="space-y-4">
              {categorySettings.map((setting) => {
                const SettingIcon = setting.icon;
                return (
                  <div
                    key={setting.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-background/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                        <SettingIcon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{setting.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {setting.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Email Toggle */}
                      <button
                        onClick={() => toggleSetting(setting.id, "email")}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-xl transition-colors",
                          setting.email
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                        )}
                        title="Email notifications"
                      >
                        <Mail className="w-4 h-4" />
                        <span className="text-xs font-medium hidden sm:inline">
                          {setting.email ? "On" : "Off"}
                        </span>
                      </button>

                      {/* Push Toggle */}
                      <button
                        onClick={() => toggleSetting(setting.id, "push")}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-xl transition-colors",
                          setting.push
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                        )}
                        title="Push notifications"
                      >
                        <Smartphone className="w-4 h-4" />
                        <span className="text-xs font-medium hidden sm:inline">
                          {setting.push ? "On" : "Off"}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Info Note */}
      <div className="glass rounded-2xl p-4 flex items-start gap-3">
        <Bell className="w-5 h-5 text-muted-foreground mt-0.5" />
        <div>
          <p className="text-sm text-muted-foreground">
            Push notifications require the Prometheus Admin mobile app or browser
            notifications to be enabled. Email notifications are sent to your
            registered email address.
          </p>
        </div>
      </div>
    </div>
  );
}

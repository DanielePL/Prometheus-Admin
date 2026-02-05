import { useState, useEffect, useMemo } from "react";
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
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  useNotificationSettings,
  useSaveNotificationSettings,
  type NotificationSettingUpdate,
} from "@/hooks/useNotificationSettings";

interface NotificationConfig {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultEmail: boolean;
  defaultPush: boolean;
  category: "creators" | "finance" | "system" | "security";
}

const notificationConfigs: NotificationConfig[] = [
  // Creators
  {
    id: "new_creator",
    label: "New Creator Sign-up",
    description: "When a new creator registers and needs approval",
    icon: UserPlus,
    defaultEmail: true,
    defaultPush: true,
    category: "creators",
  },
  {
    id: "creator_inactive",
    label: "Inactive Creator Alert",
    description: "When a creator has no referrals for 14+ days",
    icon: AlertTriangle,
    defaultEmail: true,
    defaultPush: false,
    category: "creators",
  },
  {
    id: "creator_milestone",
    label: "Creator Milestone",
    description: "When a creator reaches a referral milestone",
    icon: TrendingUp,
    defaultEmail: false,
    defaultPush: true,
    category: "creators",
  },
  {
    id: "contract_expiring",
    label: "Contract Expiring",
    description: "When a creator contract is about to expire",
    icon: FileText,
    defaultEmail: true,
    defaultPush: true,
    category: "creators",
  },

  // Finance
  {
    id: "payout_request",
    label: "Payout Request",
    description: "When a creator requests a payout",
    icon: DollarSign,
    defaultEmail: true,
    defaultPush: true,
    category: "finance",
  },
  {
    id: "payout_threshold",
    label: "Payout Threshold Reached",
    description: "When pending payouts exceed a threshold",
    icon: DollarSign,
    defaultEmail: true,
    defaultPush: false,
    category: "finance",
  },
  {
    id: "revenue_milestone",
    label: "Revenue Milestone",
    description: "When monthly revenue reaches a milestone",
    icon: TrendingUp,
    defaultEmail: false,
    defaultPush: true,
    category: "finance",
  },

  // System
  {
    id: "new_user",
    label: "New App User",
    description: "When a new user signs up for the app",
    icon: Users,
    defaultEmail: false,
    defaultPush: false,
    category: "system",
  },
  {
    id: "beta_feedback",
    label: "Beta Tester Feedback",
    description: "When a beta tester submits feedback",
    icon: Users,
    defaultEmail: true,
    defaultPush: true,
    category: "system",
  },
  {
    id: "crash_spike",
    label: "Crash Spike Alert",
    description: "When crash rate exceeds normal levels",
    icon: AlertTriangle,
    defaultEmail: true,
    defaultPush: true,
    category: "system",
  },

  // Security
  {
    id: "login_failed",
    label: "Failed Login Attempts",
    description: "When multiple failed login attempts are detected",
    icon: Shield,
    defaultEmail: true,
    defaultPush: true,
    category: "security",
  },
  {
    id: "new_device",
    label: "New Device Login",
    description: "When someone logs in from a new device",
    icon: Smartphone,
    defaultEmail: true,
    defaultPush: false,
    category: "security",
  },
];

const categories = [
  { id: "creators", label: "Creators & Partners", icon: Users },
  { id: "finance", label: "Finance & Payouts", icon: DollarSign },
  { id: "system", label: "System & App", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
] as const;

interface LocalSetting {
  id: string;
  email: boolean;
  push: boolean;
}

export function NotificationsPage() {
  const { data: savedSettings, isLoading } = useNotificationSettings();
  const saveMutation = useSaveNotificationSettings();

  // Local state for settings (allows editing before saving)
  const [localSettings, setLocalSettings] = useState<LocalSetting[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize local settings from saved data or defaults
  useEffect(() => {
    const settings = notificationConfigs.map((config) => {
      const saved = savedSettings?.find(
        (s) => s.notification_type === config.id
      );
      return {
        id: config.id,
        email: saved?.email_enabled ?? config.defaultEmail,
        push: saved?.push_enabled ?? config.defaultPush,
      };
    });
    setLocalSettings(settings);
    setHasChanges(false);
  }, [savedSettings]);

  // Get setting value
  const getSetting = (id: string) => {
    return localSettings.find((s) => s.id === id) || { id, email: false, push: false };
  };

  // Toggle setting
  const toggleSetting = (id: string, type: "email" | "push") => {
    setLocalSettings((prev) =>
      prev.map((setting) =>
        setting.id === id ? { ...setting, [type]: !setting[type] } : setting
      )
    );
    setHasChanges(true);
  };

  // Save all settings
  const handleSave = async () => {
    const updates: NotificationSettingUpdate[] = localSettings.map((s) => ({
      notification_type: s.id,
      email_enabled: s.email,
      push_enabled: s.push,
    }));

    try {
      await saveMutation.mutateAsync(updates);
      toast.success("Notification settings saved");
      setHasChanges(false);
    } catch (error) {
      toast.error("Failed to save settings");
    }
  };

  // Enable/disable all in category
  const enableAll = (category: string) => {
    const categoryIds = notificationConfigs
      .filter((c) => c.category === category)
      .map((c) => c.id);

    setLocalSettings((prev) =>
      prev.map((setting) =>
        categoryIds.includes(setting.id)
          ? { ...setting, email: true, push: true }
          : setting
      )
    );
    setHasChanges(true);
  };

  const disableAll = (category: string) => {
    const categoryIds = notificationConfigs
      .filter((c) => c.category === category)
      .map((c) => c.id);

    setLocalSettings((prev) =>
      prev.map((setting) =>
        categoryIds.includes(setting.id)
          ? { ...setting, email: false, push: false }
          : setting
      )
    );
    setHasChanges(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-6 w-72" />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-64 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">Notifications</h1>
          <p className="text-muted-foreground text-lg">
            Manage how you receive notifications
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saveMutation.isPending || !hasChanges}
          className="rounded-xl glow-orange"
        >
          {saveMutation.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {saveMutation.isPending ? "Saving..." : hasChanges ? "Save Changes" : "Saved"}
        </Button>
      </div>

      {/* Legend */}
      <div className="glass rounded-2xl p-4 flex flex-wrap items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Email</span>
        </div>
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Push Notification</span>
        </div>
        {hasChanges && (
          <span className="text-sm text-primary font-medium">
            • Unsaved changes
          </span>
        )}
      </div>

      {/* Settings by Category */}
      {categories.map((category) => {
        const categoryConfigs = notificationConfigs.filter(
          (c) => c.category === category.id
        );
        const Icon = category.icon;

        return (
          <div key={category.id} className="glass rounded-2xl p-4 sm:p-6">
            {/* Category Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
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
            <div className="space-y-3 sm:space-y-4">
              {categoryConfigs.map((config) => {
                const SettingIcon = config.icon;
                const setting = getSetting(config.id);

                return (
                  <div
                    key={config.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-background/50"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                        <SettingIcon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium">{config.label}</p>
                        <p className="text-sm text-muted-foreground truncate sm:whitespace-normal">
                          {config.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 ml-auto sm:ml-0">
                      {/* Email Toggle */}
                      <button
                        onClick={() => toggleSetting(config.id, "email")}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-xl transition-colors",
                          setting.email
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                        )}
                        title="Email notifications"
                      >
                        <Mail className="w-4 h-4" />
                        <span className="text-xs font-medium">
                          {setting.email ? "On" : "Off"}
                        </span>
                      </button>

                      {/* Push Toggle */}
                      <button
                        onClick={() => toggleSetting(config.id, "push")}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-xl transition-colors",
                          setting.push
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                        )}
                        title="Push notifications"
                      >
                        <Smartphone className="w-4 h-4" />
                        <span className="text-xs font-medium">
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
        <Bell className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
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

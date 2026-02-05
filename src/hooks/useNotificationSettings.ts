import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/api/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";

export interface NotificationSettingRow {
  id: string;
  user_email: string;
  notification_type: string;
  email_enabled: boolean;
  push_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationSettingUpdate {
  notification_type: string;
  email_enabled: boolean;
  push_enabled: boolean;
}

// Query keys
export const notificationKeys = {
  all: ["notification-settings"] as const,
  user: (email: string) => [...notificationKeys.all, email] as const,
};

// Fetch notification settings for current user
export function useNotificationSettings() {
  const { user } = useAuth();
  const userEmail = user?.email || "";

  return useQuery({
    queryKey: notificationKeys.user(userEmail),
    queryFn: async (): Promise<NotificationSettingRow[]> => {
      if (!supabase || !userEmail) return [];

      // First, try to initialize settings if they don't exist
      try {
        await supabase.rpc("initialize_notification_settings", {
          p_user_email: userEmail,
        });
      } catch {
        // Function might not exist yet, ignore error
      }

      const { data, error } = await supabase
        .from("notification_settings")
        .select("*")
        .eq("user_email", userEmail);

      if (error) {
        console.error("Error fetching notification settings:", error);
        return [];
      }

      return data || [];
    },
    enabled: !!userEmail,
  });
}

// Save all notification settings
export function useSaveNotificationSettings() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userEmail = user?.email || "";

  return useMutation({
    mutationFn: async (settings: NotificationSettingUpdate[]) => {
      if (!supabase || !userEmail) {
        throw new Error("Not authenticated or Supabase not configured");
      }

      // Upsert all settings
      const upsertData = settings.map((s) => ({
        user_email: userEmail,
        notification_type: s.notification_type,
        email_enabled: s.email_enabled,
        push_enabled: s.push_enabled,
      }));

      const { error } = await supabase
        .from("notification_settings")
        .upsert(upsertData, {
          onConflict: "user_email,notification_type",
        });

      if (error) {
        console.error("Error saving notification settings:", error);
        throw error;
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.user(userEmail) });
    },
  });
}

// Toggle a single notification setting
export function useToggleNotificationSetting() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userEmail = user?.email || "";

  return useMutation({
    mutationFn: async ({
      notificationType,
      field,
      value,
    }: {
      notificationType: string;
      field: "email_enabled" | "push_enabled";
      value: boolean;
    }) => {
      if (!supabase || !userEmail) {
        throw new Error("Not authenticated or Supabase not configured");
      }

      const { error } = await supabase
        .from("notification_settings")
        .upsert(
          {
            user_email: userEmail,
            notification_type: notificationType,
            [field]: value,
          },
          {
            onConflict: "user_email,notification_type",
          }
        );

      if (error) {
        console.error("Error toggling notification setting:", error);
        throw error;
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.user(userEmail) });
    },
  });
}

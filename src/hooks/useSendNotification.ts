import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/api/supabaseClient";

export interface SendNotificationParams {
  to_email: string;
  to_name?: string;
  notification_type: string;
  subject?: string;
  body_text?: string;
  body_html?: string;
  data?: Record<string, unknown>;
}

export interface SendNotificationResult {
  success: boolean;
  email_id?: string;
  skipped?: boolean;
  simulated?: boolean;
  reason?: string;
  error?: string;
}

/**
 * Hook to send notifications via Supabase Edge Function
 */
export function useSendNotification() {
  return useMutation({
    mutationFn: async (params: SendNotificationParams): Promise<SendNotificationResult> => {
      if (!supabase) {
        throw new Error("Supabase not configured");
      }

      const { data, error } = await supabase.functions.invoke("send-notification", {
        body: params,
      });

      if (error) {
        console.error("Failed to send notification:", error);
        throw error;
      }

      return data as SendNotificationResult;
    },
  });
}

/**
 * Send notification directly (non-hook version for use outside components)
 */
export async function sendNotification(params: SendNotificationParams): Promise<SendNotificationResult> {
  if (!supabase) {
    console.warn("Supabase not configured, skipping notification");
    return { success: false, error: "Supabase not configured" };
  }

  try {
    const { data, error } = await supabase.functions.invoke("send-notification", {
      body: params,
    });

    if (error) {
      console.error("Failed to send notification:", error);
      return { success: false, error: error.message };
    }

    return data as SendNotificationResult;
  } catch (err) {
    console.error("Error sending notification:", err);
    return { success: false, error: String(err) };
  }
}

// Team members for assignment dropdowns
export const TEAM_EMAILS = {
  daniele: "management@prometheus.coach",
  karin: "admin@prometheus.coach",
  sjoerd: "campus@prometheus.coach",
  valerie: "partners@prometheus.coach",
  basil: "lab@prometheus.coach",
} as const;

export const TEAM_MEMBERS_LIST = [
  { email: "management@prometheus.coach", name: "Daniele", role: "Super Admin" },
  { email: "admin@prometheus.coach", name: "Karin", role: "Admin" },
  { email: "campus@prometheus.coach", name: "Sjoerd", role: "Campus" },
  { email: "partners@prometheus.coach", name: "Valerie", role: "Partner Manager" },
  { email: "lab@prometheus.coach", name: "Basil", role: "Lab" },
] as const;

/**
 * Helper to send task assignment notification
 */
export async function notifyTaskAssigned(params: {
  assigneeEmail: string;
  taskTitle: string;
  taskDescription?: string;
  assignedByName: string;
  dueDate?: string;
  taskUrl?: string;
}): Promise<SendNotificationResult> {
  const assignee = TEAM_MEMBERS_LIST.find((m) => m.email === params.assigneeEmail);

  return sendNotification({
    to_email: params.assigneeEmail,
    to_name: assignee?.name,
    notification_type: "task_assigned",
    data: {
      task_title: params.taskTitle,
      task_description: params.taskDescription,
      assigned_by: params.assignedByName,
      due_date: params.dueDate,
      task_url: params.taskUrl || "https://admin.prometheus.coach/tasks",
      to_name: assignee?.name,
    },
  });
}

/**
 * Helper to send new creator notification
 */
export async function notifyNewCreator(params: {
  creatorName: string;
  creatorEmail: string;
  instagram?: string;
}): Promise<SendNotificationResult[]> {
  // Notify all admins (Daniele, Karin, Valerie)
  const adminsToNotify = [
    TEAM_EMAILS.daniele,
    TEAM_EMAILS.karin,
    TEAM_EMAILS.valerie,
  ];

  const results = await Promise.all(
    adminsToNotify.map((email) =>
      sendNotification({
        to_email: email,
        notification_type: "new_creator",
        data: {
          creator_name: params.creatorName,
          creator_email: params.creatorEmail,
          instagram: params.instagram,
        },
      })
    )
  );

  return results;
}

/**
 * Helper to send payout request notification
 */
export async function notifyPayoutRequest(params: {
  creatorName: string;
  amount: number;
  payoutMethod?: string;
}): Promise<SendNotificationResult[]> {
  // Notify finance admins (Daniele, Karin)
  const adminsToNotify = [TEAM_EMAILS.daniele, TEAM_EMAILS.karin];

  const results = await Promise.all(
    adminsToNotify.map((email) =>
      sendNotification({
        to_email: email,
        notification_type: "payout_request",
        data: {
          creator_name: params.creatorName,
          amount: params.amount.toFixed(2),
          payout_method: params.payoutMethod || "Bank Transfer",
        },
      })
    )
  );

  return results;
}

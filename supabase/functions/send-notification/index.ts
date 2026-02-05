// Supabase Edge Function: send-notification
// Sends email notifications for tasks, alerts, etc.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  to_email: string;
  to_name?: string;
  notification_type: string;
  subject: string;
  body_text: string;
  body_html?: string;
  data?: Record<string, unknown>;
}

// Email templates for different notification types
const getEmailTemplate = (type: string, data: Record<string, unknown> = {}): { subject: string; html: string } => {
  const templates: Record<string, { subject: string; html: string }> = {
    task_assigned: {
      subject: `Task assigned: ${data.task_title || "New Task"}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 24px; border-radius: 16px 16px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🔥 Prometheus Admin</h1>
          </div>
          <div style="background: #1a1a1a; padding: 24px; color: #e5e5e5;">
            <h2 style="color: #f97316; margin-top: 0;">New Task Assigned</h2>
            <p>Hi ${data.to_name || "there"},</p>
            <p>A new task has been assigned to you:</p>
            <div style="background: #262626; padding: 16px; border-radius: 12px; margin: 16px 0;">
              <h3 style="color: white; margin: 0 0 8px 0;">${data.task_title || "Task"}</h3>
              <p style="color: #a3a3a3; margin: 0;">${data.task_description || ""}</p>
              ${data.due_date ? `<p style="color: #f97316; margin: 8px 0 0 0;">Due: ${data.due_date}</p>` : ""}
            </div>
            <p>Assigned by: ${data.assigned_by || "Team"}</p>
            <a href="${data.task_url || "https://admin.prometheus.coach/tasks"}"
               style="display: inline-block; background: #f97316; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">
              View Task
            </a>
          </div>
          <div style="background: #0a0a0a; padding: 16px; text-align: center; border-radius: 0 0 16px 16px;">
            <p style="color: #525252; margin: 0; font-size: 12px;">Prometheus Admin • AI-Powered Fitness & Nutrition Coaching</p>
          </div>
        </div>
      `,
    },
    new_creator: {
      subject: "New Creator Sign-up Requires Approval",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 24px; border-radius: 16px 16px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🔥 Prometheus Admin</h1>
          </div>
          <div style="background: #1a1a1a; padding: 24px; color: #e5e5e5;">
            <h2 style="color: #22c55e; margin-top: 0;">New Creator Registration</h2>
            <p>A new creator has signed up and needs approval:</p>
            <div style="background: #262626; padding: 16px; border-radius: 12px; margin: 16px 0;">
              <p style="margin: 0;"><strong>Name:</strong> ${data.creator_name || "Unknown"}</p>
              <p style="margin: 8px 0 0 0;"><strong>Email:</strong> ${data.creator_email || ""}</p>
              <p style="margin: 8px 0 0 0;"><strong>Instagram:</strong> @${data.instagram || "N/A"}</p>
            </div>
            <a href="https://admin.prometheus.coach/partners"
               style="display: inline-block; background: #f97316; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">
              Review Creator
            </a>
          </div>
          <div style="background: #0a0a0a; padding: 16px; text-align: center; border-radius: 0 0 16px 16px;">
            <p style="color: #525252; margin: 0; font-size: 12px;">Prometheus Admin • AI-Powered Fitness & Nutrition Coaching</p>
          </div>
        </div>
      `,
    },
    payout_request: {
      subject: `Payout Request: ${data.creator_name || "Creator"}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 24px; border-radius: 16px 16px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🔥 Prometheus Admin</h1>
          </div>
          <div style="background: #1a1a1a; padding: 24px; color: #e5e5e5;">
            <h2 style="color: #eab308; margin-top: 0;">💰 Payout Request</h2>
            <p>A creator has requested a payout:</p>
            <div style="background: #262626; padding: 16px; border-radius: 12px; margin: 16px 0;">
              <p style="margin: 0;"><strong>Creator:</strong> ${data.creator_name || "Unknown"}</p>
              <p style="margin: 8px 0 0 0;"><strong>Amount:</strong> $${data.amount || "0.00"}</p>
              <p style="margin: 8px 0 0 0;"><strong>Method:</strong> ${data.payout_method || "Bank Transfer"}</p>
            </div>
            <a href="https://admin.prometheus.coach/payouts"
               style="display: inline-block; background: #f97316; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">
              Process Payout
            </a>
          </div>
          <div style="background: #0a0a0a; padding: 16px; text-align: center; border-radius: 0 0 16px 16px;">
            <p style="color: #525252; margin: 0; font-size: 12px;">Prometheus Admin • AI-Powered Fitness & Nutrition Coaching</p>
          </div>
        </div>
      `,
    },
    generic: {
      subject: data.subject as string || "Notification from Prometheus",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 24px; border-radius: 16px 16px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🔥 Prometheus Admin</h1>
          </div>
          <div style="background: #1a1a1a; padding: 24px; color: #e5e5e5;">
            <h2 style="color: #f97316; margin-top: 0;">${data.title || "Notification"}</h2>
            <p>${data.message || ""}</p>
            ${data.action_url ? `
              <a href="${data.action_url}"
                 style="display: inline-block; background: #f97316; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">
                ${data.action_text || "View Details"}
              </a>
            ` : ""}
          </div>
          <div style="background: #0a0a0a; padding: 16px; text-align: center; border-radius: 0 0 16px 16px;">
            <p style="color: #525252; margin: 0; font-size: 12px;">Prometheus Admin • AI-Powered Fitness & Nutrition Coaching</p>
          </div>
        </div>
      `,
    },
  };

  return templates[type] || templates.generic;
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload: NotificationRequest = await req.json();
    const { to_email, to_name, notification_type, subject, body_text, body_html, data } = payload;

    if (!to_email || !notification_type) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to_email, notification_type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user has email notifications enabled for this type
    const { data: settings } = await supabase
      .from("notification_settings")
      .select("email_enabled")
      .eq("user_email", to_email)
      .eq("notification_type", notification_type)
      .single();

    // Default to enabled if no settings found
    const emailEnabled = settings?.email_enabled ?? true;

    if (!emailEnabled) {
      return new Response(
        JSON.stringify({
          success: true,
          skipped: true,
          reason: "Email notifications disabled for this type"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get email template
    const template = getEmailTemplate(notification_type, { ...data, to_name, subject });
    const finalSubject = subject || template.subject;
    const finalHtml = body_html || template.html;
    const finalText = body_text || finalSubject;

    // Send email via Resend API (you can also use SMTP here)
    if (!resendApiKey) {
      console.log("RESEND_API_KEY not configured, logging email instead:");
      console.log({ to: to_email, subject: finalSubject, html: finalHtml });

      return new Response(
        JSON.stringify({
          success: true,
          simulated: true,
          message: "Email logged (RESEND_API_KEY not configured)"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Prometheus Admin <notifications@prometheus.coach>",
        to: to_email,
        subject: finalSubject,
        html: finalHtml,
        text: finalText,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      console.error("Resend API error:", errorData);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: errorData }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await emailResponse.json();

    // Log the notification
    await supabase.from("notification_log").insert({
      recipient_email: to_email,
      notification_type,
      subject: finalSubject,
      status: "sent",
      email_id: result.id,
    }).catch(() => {
      // Ignore if table doesn't exist
    });

    return new Response(
      JSON.stringify({ success: true, email_id: result.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.98.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface KpiTarget {
  metric_key: string;
  target_value: number;
  threshold_percent: number; // e.g. 80 means alert if actual < 80% of target
}

const DEFAULT_KPI_TARGETS: KpiTarget[] = [
  { metric_key: "arr", target_value: 18, threshold_percent: 75 },
  { metric_key: "nrr", target_value: 130, threshold_percent: 90 },
  { metric_key: "activation", target_value: 80, threshold_percent: 85 },
  { metric_key: "hectares", target_value: 3.0, threshold_percent: 70 },
  { metric_key: "carbon", target_value: 1000, threshold_percent: 75 },
  { metric_key: "win_rate", target_value: 40, threshold_percent: 75 },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Fetch current metrics
    const { data: metrics, error: metricsError } = await supabase
      .from("dashboard_metrics")
      .select("metric_key, metric_value, metric_unit");

    if (metricsError) throw metricsError;

    const metricsMap: Record<string, number> = {};
    for (const m of metrics || []) {
      metricsMap[m.metric_key] = Number(m.metric_value);
    }

    // Check each KPI against threshold
    const alerts: { metric: string; actual: number; target: number; percent: number }[] = [];

    for (const kpi of DEFAULT_KPI_TARGETS) {
      const actual = metricsMap[kpi.metric_key];
      if (actual === undefined) continue;

      const percent = (actual / kpi.target_value) * 100;
      if (percent < kpi.threshold_percent) {
        alerts.push({
          metric: kpi.metric_key,
          actual,
          target: kpi.target_value,
          percent: Math.round(percent),
        });
      }
    }

    if (alerts.length === 0) {
      return new Response(
        JSON.stringify({ message: "All KPIs within threshold", alerts: [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get admin emails from profiles + user_roles
    const { data: adminRoles } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");

    const adminIds = (adminRoles || []).map((r) => r.user_id);

    if (adminIds.length === 0) {
      return new Response(
        JSON.stringify({ message: "No admins to notify", alerts }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: profiles } = await supabase
      .from("profiles")
      .select("email")
      .in("id", adminIds);

    const adminEmails = (profiles || []).map((p) => p.email).filter(Boolean);

    // Insert strategic alerts for each KPI behind threshold
    const alertInserts = alerts.map((a) => ({
      alert_type: "kpi_breach",
      title: `KPI Alert: ${a.metric.toUpperCase()} at ${a.percent}% of target`,
      value: `Actual: ${a.actual} / Target: ${a.target}`,
    }));

    await supabase.from("strategic_alerts").insert(alertInserts);

    // Log notification (email sending would require an email provider)
    console.log(`KPI alerts generated for ${adminEmails.length} admin(s):`, alerts);

    return new Response(
      JSON.stringify({
        message: `${alerts.length} KPI alert(s) generated`,
        alerts,
        notified: adminEmails,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("KPI alert check failed:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

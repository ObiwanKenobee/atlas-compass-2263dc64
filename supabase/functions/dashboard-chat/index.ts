import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { messages } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all current data for context
    const [metricsRes, alertsRes, ecosystemRes] = await Promise.all([
      supabase.from("dashboard_metrics").select("*"),
      supabase.from("strategic_alerts").select("*").order("created_at", { ascending: false }).limit(10),
      supabase.from("ecosystem_metrics").select("*").order("recorded_at", { ascending: true }),
    ]);

    const metrics = metricsRes.data || [];
    const alerts = alertsRes.data || [];
    const ecosystem = ecosystemRes.data || [];

    const metricsContext = metrics.map(m =>
      `${m.metric_key}: ${m.metric_value}${m.metric_unit || ""} (change: ${m.change_percent != null ? m.change_percent + "%" : "n/a"}, metadata: ${JSON.stringify(m.metadata)})`
    ).join("\n");

    const alertsContext = alerts.map(a =>
      `[${a.alert_type}] ${a.title}: ${a.value} (${a.created_at})`
    ).join("\n");

    const ecosystemContext = ecosystem.map(e =>
      `${e.month}: ${e.hectares}M hectares, ${e.carbon}K tons carbon, ${e.projects} projects`
    ).join("\n");

    const systemPrompt = `You are Atlas, the AI analytics assistant for Atlas Sanctum — a climate-tech platform focused on ecosystem restoration verification and carbon credit trading.

You have access to the following live dashboard data:

## Key Metrics
${metricsContext}

## Recent Strategic Alerts
${alertsContext}

## Ecosystem Trend (Monthly)
${ecosystemContext}

## Additional Context
- Pipeline: Leads 248 ($42.1M) → Qualified 94 ($28.6M) → Proposal 49 ($18.2M) → Closed Won 30 ($11.1M). Win rate 34%, avg deal $370K.
- Customer Health: 218 healthy, 42 at-risk, 8 critical. Avg NPS 72.
- Top customers: Nordic Climate Fund ($2.8M, health 95), Amazon Conservation ($1.9M, health 88), EU Green Transition ($2.1M, health 82).
- At-risk: Sahel Restoration Initiative (health 45, $620K), SE Asia Carbon Trust (health 38, $540K).

Answer questions about the data concisely and accurately. Use specific numbers. If asked to compare, calculate, or analyze trends, do so. Format responses with markdown when helpful. Keep answers focused — 2-4 sentences for simple questions, more for complex analysis.

Today's date: ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("dashboard-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

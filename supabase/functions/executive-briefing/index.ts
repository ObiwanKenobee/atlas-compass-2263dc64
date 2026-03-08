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

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch current metrics
    const [metricsRes, alertsRes, ecosystemRes] = await Promise.all([
      supabase.from("dashboard_metrics").select("*"),
      supabase.from("strategic_alerts").select("*").order("created_at", { ascending: false }).limit(5),
      supabase.from("ecosystem_metrics").select("*").order("recorded_at", { ascending: false }).limit(1),
    ]);

    const metrics = metricsRes.data || [];
    const alerts = alertsRes.data || [];
    const ecosystem = ecosystemRes.data || [];

    const metricsContext = metrics.length > 0
      ? metrics.map(m => `${m.metric_key}: ${m.metric_value}${m.metric_unit || ""} (${m.change_percent != null ? (m.change_percent > 0 ? "+" : "") + m.change_percent + "%" : "no change"})`).join("; ")
      : "ARR: $14.2M (+34%), NRR: 127% (+8%), Customer Growth: 48% (+12%), Cash Runway: 28 months";

    const alertsContext = alerts.length > 0
      ? alerts.map(a => `[${a.alert_type}] ${a.title}: ${a.value}`).join("; ")
      : "Nordic Climate Fund $2.8M contract signed; Kenya Ministry partnership initiated; 2M hectares milestone reached";

    const ecosystemContext = ecosystem.length > 0
      ? `Latest: ${ecosystem[0].hectares}M hectares, ${ecosystem[0].carbon}K tons carbon, ${ecosystem[0].projects} projects`
      : "2.4M hectares analyzed, 847K tons carbon verified, 1284 projects validated";

    const prompt = `You are the Chief Strategy AI for Atlas Sanctum, a climate-tech platform focused on ecosystem restoration verification and carbon credit trading.

Generate a concise executive briefing (3-4 sentences max) for the C-suite based on today's data. Be specific with numbers. Highlight the most important trend, one risk, and one opportunity. Use a confident, strategic tone — no fluff.

Current metrics: ${metricsContext}
Recent alerts: ${alertsContext}
Ecosystem impact: ${ecosystemContext}
Date: ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "user", content: prompt }],
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

    const data = await response.json();
    const briefing = data.choices?.[0]?.message?.content || "Unable to generate briefing at this time.";

    return new Response(JSON.stringify({ briefing, generated_at: new Date().toISOString() }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("executive-briefing error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

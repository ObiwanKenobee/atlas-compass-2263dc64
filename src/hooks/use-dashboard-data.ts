import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DashboardMetric {
  metric_key: string;
  metric_value: number;
  metric_unit: string | null;
  change_percent: number | null;
  metadata: Record<string, any>;
}

export interface EcosystemTrend {
  month: string;
  hectares: number;
  carbon: number;
  projects: number;
}

export interface StrategicAlert {
  id: string;
  alert_type: "contract" | "partnership" | "ecosystem" | "transaction";
  title: string;
  value: string;
  created_at: string;
}

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dashboard_metrics")
        .select("metric_key, metric_value, metric_unit, change_percent, metadata");
      if (error) throw error;

      const map: Record<string, DashboardMetric> = {};
      for (const row of data) {
        map[row.metric_key] = {
          metric_key: row.metric_key,
          metric_value: Number(row.metric_value),
          metric_unit: row.metric_unit,
          change_percent: row.change_percent != null ? Number(row.change_percent) : null,
          metadata: (row.metadata as Record<string, any>) || {},
        };
      }
      return map;
    },
    refetchInterval: 30000, // refresh every 30s
  });
}

export function useEcosystemTrend() {
  return useQuery({
    queryKey: ["ecosystem-trend"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ecosystem_metrics")
        .select("month, hectares, carbon, projects")
        .order("recorded_at", { ascending: true });
      if (error) throw error;
      return data.map((r) => ({
        month: r.month,
        hectares: Number(r.hectares),
        carbon: Number(r.carbon),
        projects: r.projects ?? 0,
      })) as EcosystemTrend[];
    },
    refetchInterval: 30000,
  });
}

export function useStrategicAlerts() {
  return useQuery({
    queryKey: ["strategic-alerts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("strategic_alerts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data as StrategicAlert[];
    },
    refetchInterval: 30000,
  });
}

// Helper to format time ago
export function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "just now";
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

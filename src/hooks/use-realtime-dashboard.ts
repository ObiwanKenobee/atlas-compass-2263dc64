import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useRealtimeDashboard() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("dashboard-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "dashboard_metrics" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ecosystem_metrics" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["ecosystem-trend"] });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "strategic_alerts" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["strategic-alerts"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}

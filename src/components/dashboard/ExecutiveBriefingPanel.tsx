import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import AnimatedSection from "./AnimatedSection";

async function fetchBriefing() {
  const { data, error } = await supabase.functions.invoke("executive-briefing");
  if (error) throw error;
  return data as { briefing: string; generated_at: string };
}

const ExecutiveBriefingPanel = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["executive-briefing", refreshKey],
    queryFn: fetchBriefing,
    staleTime: 5 * 60 * 1000, // 5 min
    retry: 1,
  });

  return (
    <AnimatedSection>
      <Card className="relative overflow-hidden border-sage/20 bg-gradient-to-br from-sage/5 via-background to-cyan/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--sage)/0.08),transparent_60%)]" />
        <CardContent className="relative p-5 sm:p-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-sage/10">
                <Sparkles className="h-3.5 w-3.5 text-sage" />
              </div>
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  AI Executive Briefing
                </h2>
              </div>
            </div>
            <button
              onClick={() => { setRefreshKey(k => k + 1); refetch(); }}
              disabled={isLoading || isRefetching}
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50"
            >
              <RefreshCw className={`h-3 w-3 ${isRefetching ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-2.5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[75%]" />
            </div>
          ) : data?.briefing ? (
            <motion.p
              key={data.generated_at}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-sm leading-relaxed text-foreground/90"
            >
              {data.briefing}
            </motion.p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Unable to generate briefing. Click refresh to try again.
            </p>
          )}

          {data?.generated_at && (
            <p className="mt-3 text-[10px] text-muted-foreground">
              Generated {new Date(data.generated_at).toLocaleTimeString()}
            </p>
          )}
        </CardContent>
      </Card>
    </AnimatedSection>
  );
};

export default ExecutiveBriefingPanel;

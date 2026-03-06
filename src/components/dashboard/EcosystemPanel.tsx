import { useState, useMemo } from "react";
import { ecosystemMetrics } from "@/lib/dashboard-data";
import { useDashboardMetrics, useEcosystemTrend } from "@/hooks/use-dashboard-data";
import MetricCard from "./MetricCard";
import AnimatedSection from "./AnimatedSection";
import { TimeRangeSelector, type TimeRange } from "./TimeRangeSelector";
import { Area, AreaChart, ResponsiveContainer, XAxis, Tooltip } from "recharts";

const EcosystemPanel = () => {
  const { data: liveMetrics } = useDashboardMetrics();
  const { data: liveTrend } = useEcosystemTrend();
  const [timeRange, setTimeRange] = useState<TimeRange>("6M");

  const ha = liveMetrics?.hectares_analyzed ?? { metric_value: ecosystemMetrics.hectaresAnalyzed.value, metric_unit: ecosystemMetrics.hectaresAnalyzed.unit, change_percent: ecosystemMetrics.hectaresAnalyzed.change };
  const co2 = liveMetrics?.carbon_verified ?? { metric_value: ecosystemMetrics.carbonVerified.value, metric_unit: ecosystemMetrics.carbonVerified.unit, change_percent: ecosystemMetrics.carbonVerified.change };
  const pv = liveMetrics?.projects_validated ?? { metric_value: ecosystemMetrics.projectsValidated.value, change_percent: ecosystemMetrics.projectsValidated.change };
  const at = liveMetrics?.assets_traded ?? { metric_value: ecosystemMetrics.assetsTraded.value, metric_unit: ecosystemMetrics.assetsTraded.unit, change_percent: ecosystemMetrics.assetsTraded.change };

  const trendData = liveTrend ?? ecosystemMetrics.monthlyTrend;
  const sliceCount = timeRange === "3M" ? 3 : 6;
  const slicedTrend = useMemo(() => trendData.slice(-sliceCount), [sliceCount, trendData]);

  return (
    <AnimatedSection delay={0.05}>
      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-amber" />
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Ecosystem Impact Monitor
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <div className="grid grid-cols-2 gap-3 lg:col-span-1">
            <MetricCard label="Hectares Analyzed" value={`${ha.metric_value}`} unit={(ha as any).metric_unit ?? "M"} change={ha.change_percent ?? undefined}
              drilldown={{ title: "Hectares Analyzed", description: "Total land area analyzed or restored", details: [{ label: "Active Restoration", value: "1.8M ha" }, { label: "Monitoring Phase", value: "420K ha" }, { label: "Completed Projects", value: "180K ha" }, { label: "New This Quarter", value: "+340K ha" }] }} />
            <MetricCard label="Carbon Verified" value={co2.metric_value} unit={(co2 as any).metric_unit ?? "K tons"} change={co2.change_percent ?? undefined}
              drilldown={{ title: "Carbon Sequestration", description: "CO₂ verified through platform", details: [{ label: "Forest Carbon", value: "412K tons" }, { label: "Soil Carbon", value: "285K tons" }, { label: "Blue Carbon", value: "150K tons" }, { label: "Pending", value: "94K tons" }] }} />
            <MetricCard label="Projects Validated" value={pv.metric_value.toLocaleString()} change={pv.change_percent ?? undefined}
              drilldown={{ title: "Ecosystem Projects", description: "Restoration projects validated", details: [{ label: "Active", value: "842" }, { label: "Completed", value: "312" }, { label: "In Validation", value: "130" }, { label: "Avg. Duration", value: "18 months" }] }} />
            <MetricCard label="Assets Traded" value={`$${at.metric_value}`} unit={(at as any).metric_unit ?? "M"} change={at.change_percent ?? undefined}
              drilldown={{ title: "Regenerative Asset Exchange", description: "Total value traded on platform", details: [{ label: "Carbon Credits", value: "$52.1M" }, { label: "Biodiversity Credits", value: "$18.4M" }, { label: "Water Credits", value: "$12.3M" }, { label: "Avg. Transaction", value: "$84K" }] }} />
          </div>

          <div className="rounded-lg border border-border bg-card p-5 lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Ecosystem Growth Trajectory</div>
              <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={slicedTrend}>
                  <defs>
                    <linearGradient id="hectaresGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(152, 35%, 52%)" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="hsl(152, 35%, 52%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="carbonGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(192, 60%, 50%)" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="hsl(192, 60%, 50%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(215, 12%, 50%)" }} />
                  <Tooltip contentStyle={{ background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: "6px", fontSize: "11px", color: "hsl(210, 20%, 92%)" }} />
                  <Area type="monotone" dataKey="hectares" stroke="hsl(152, 35%, 52%)" strokeWidth={1.5} fill="url(#hectaresGrad)" name="Hectares (M)" animationDuration={600} />
                  <Area type="monotone" dataKey="carbon" stroke="hsl(192, 60%, 50%)" strokeWidth={1.5} fill="url(#carbonGrad)" name="Carbon (K tons)" animationDuration={600} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
};

export default EcosystemPanel;

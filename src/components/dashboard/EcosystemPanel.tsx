import { useState, useMemo } from "react";
import { ecosystemMetrics } from "@/lib/dashboard-data";
import MetricCard from "./MetricCard";
import AnimatedSection from "./AnimatedSection";
import { TimeRangeSelector, type TimeRange } from "./TimeRangeSelector";
import { Area, AreaChart, ResponsiveContainer, XAxis, Tooltip } from "recharts";

const EcosystemPanel = () => {
  const { hectaresAnalyzed, carbonVerified, projectsValidated, assetsTraded, monthlyTrend } = ecosystemMetrics;
  const [timeRange, setTimeRange] = useState<TimeRange>("6M");

  const sliceCount = timeRange === "3M" ? 3 : timeRange === "6M" ? 6 : 6; // max data is 6
  const trendData = useMemo(() => monthlyTrend.slice(-sliceCount), [sliceCount]);

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
            <MetricCard
              label="Hectares Analyzed"
              value={`${hectaresAnalyzed.value}`}
              unit={hectaresAnalyzed.unit}
              change={hectaresAnalyzed.change}
              drilldown={{
                title: "Hectares Analyzed",
                description: "Total land area analyzed or restored through the platform",
                details: [
                  { label: "Active Restoration", value: "1.8M ha" },
                  { label: "Monitoring Phase", value: "420K ha" },
                  { label: "Completed Projects", value: "180K ha" },
                  { label: "New This Quarter", value: "+340K ha" },
                ],
              }}
            />
            <MetricCard
              label="Carbon Verified"
              value={carbonVerified.value}
              unit={carbonVerified.unit}
              change={carbonVerified.change}
              drilldown={{
                title: "Carbon Sequestration",
                description: "CO₂ verified through platform measurement tools",
                details: [
                  { label: "Forest Carbon", value: "412K tons" },
                  { label: "Soil Carbon", value: "285K tons" },
                  { label: "Blue Carbon", value: "150K tons" },
                  { label: "Pending Verification", value: "94K tons" },
                ],
              }}
            />
            <MetricCard
              label="Projects Validated"
              value={projectsValidated.value.toLocaleString()}
              change={projectsValidated.change}
              drilldown={{
                title: "Ecosystem Projects",
                description: "Restoration projects validated through the platform",
                details: [
                  { label: "Active Projects", value: "842" },
                  { label: "Completed", value: "312" },
                  { label: "In Validation", value: "130" },
                  { label: "Avg. Duration", value: "18 months" },
                ],
              }}
            />
            <MetricCard
              label="Assets Traded"
              value={`$${assetsTraded.value}`}
              unit={assetsTraded.unit}
              change={assetsTraded.change}
              drilldown={{
                title: "Regenerative Asset Exchange",
                description: "Total value of assets traded on the platform",
                details: [
                  { label: "Carbon Credits", value: "$52.1M" },
                  { label: "Biodiversity Credits", value: "$18.4M" },
                  { label: "Water Credits", value: "$12.3M" },
                  { label: "Avg. Transaction", value: "$84K" },
                ],
              }}
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-5 lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Ecosystem Growth Trajectory
              </div>
              <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
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
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "hsl(215, 12%, 50%)" }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(220, 18%, 10%)",
                      border: "1px solid hsl(220, 15%, 18%)",
                      borderRadius: "6px",
                      fontSize: "11px",
                      color: "hsl(210, 20%, 92%)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="hectares"
                    stroke="hsl(152, 35%, 52%)"
                    strokeWidth={1.5}
                    fill="url(#hectaresGrad)"
                    name="Hectares (M)"
                    animationDuration={600}
                  />
                  <Area
                    type="monotone"
                    dataKey="carbon"
                    stroke="hsl(192, 60%, 50%)"
                    strokeWidth={1.5}
                    fill="url(#carbonGrad)"
                    name="Carbon (K tons)"
                    animationDuration={600}
                  />
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

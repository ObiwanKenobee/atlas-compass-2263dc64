import { ecosystemMetrics } from "@/lib/dashboard-data";
import MetricCard from "./MetricCard";
import { Area, AreaChart, ResponsiveContainer, XAxis, Tooltip } from "recharts";

const EcosystemPanel = () => {
  const { hectaresAnalyzed, carbonVerified, projectsValidated, assetsTraded, monthlyTrend } = ecosystemMetrics;

  return (
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
          />
          <MetricCard
            label="Carbon Verified"
            value={carbonVerified.value}
            unit={carbonVerified.unit}
            change={carbonVerified.change}
          />
          <MetricCard
            label="Projects Validated"
            value={projectsValidated.value.toLocaleString()}
            change={projectsValidated.change}
          />
          <MetricCard
            label="Assets Traded"
            value={`$${assetsTraded.value}`}
            unit={assetsTraded.unit}
            change={assetsTraded.change}
          />
        </div>

        <div className="rounded-lg border border-border bg-card p-5 lg:col-span-2">
          <div className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Ecosystem Growth Trajectory
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend}>
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
                />
                <Area
                  type="monotone"
                  dataKey="carbon"
                  stroke="hsl(192, 60%, 50%)"
                  strokeWidth={1.5}
                  fill="url(#carbonGrad)"
                  name="Carbon (K tons)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EcosystemPanel;

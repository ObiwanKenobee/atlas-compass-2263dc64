import { northStarMetrics } from "@/lib/dashboard-data";
import MetricCard from "./MetricCard";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

const NorthStarPanel = () => {
  const { arr, nrr, customerGrowth, cashRunway } = northStarMetrics;

  const arrChartData = arr.months.map((month, i) => ({
    month,
    value: arr.trend[i],
  }));

  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-sage animate-pulse-soft" />
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          North Star Metrics
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Annual Recurring Revenue"
          value={`$${arr.value}`}
          unit="M"
          change={arr.change}
          subtitle="YoY"
        >
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={arrChartData}>
                <defs>
                  <linearGradient id="arrGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(152, 35%, 52%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(152, 35%, 52%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(152, 35%, 52%)"
                  strokeWidth={1.5}
                  fill="url(#arrGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </MetricCard>

        <MetricCard
          label="Net Revenue Retention"
          value={nrr.value}
          unit="%"
          change={nrr.change}
          subtitle={`Benchmark: ${nrr.benchmark}%`}
        >
          <div className="mt-1 h-1.5 rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-sage transition-all"
              style={{ width: `${Math.min((nrr.value / 150) * 100, 100)}%` }}
            />
          </div>
        </MetricCard>

        <MetricCard
          label="Customer Growth Rate"
          value={customerGrowth.value}
          unit="% QoQ"
          change={customerGrowth.change}
          subtitle={`${customerGrowth.totalCustomers} total`}
        >
          <div className="flex items-end gap-[2px] h-10">
            {customerGrowth.trend.map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-sage/30 transition-all hover:bg-sage/60"
                style={{ height: `${(v / Math.max(...customerGrowth.trend)) * 100}%` }}
              />
            ))}
          </div>
        </MetricCard>

        <MetricCard
          label="Cash Runway"
          value={cashRunway.value}
          unit="months"
          subtitle={`$${cashRunway.cashOnHand}M at $${cashRunway.burnRate}M/mo burn`}
        >
          <div className="mt-1 h-1.5 rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-amber transition-all"
              style={{ width: `${Math.min((cashRunway.value / 36) * 100, 100)}%` }}
            />
          </div>
        </MetricCard>
      </div>
    </section>
  );
};

export default NorthStarPanel;

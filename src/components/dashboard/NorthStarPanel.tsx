import { useState, useMemo } from "react";
import { northStarMetrics } from "@/lib/dashboard-data";
import MetricCard from "./MetricCard";
import { TimeRangeSelector, type TimeRange } from "./TimeRangeSelector";
import AnimatedSection from "./AnimatedSection";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

const NorthStarPanel = () => {
  const { arr, nrr, customerGrowth, cashRunway } = northStarMetrics;
  const [timeRange, setTimeRange] = useState<TimeRange>("12M");

  const sliceCount = timeRange === "3M" ? 3 : timeRange === "6M" ? 6 : 12;

  const arrChartData = useMemo(
    () =>
      arr.months.slice(-sliceCount).map((month, i) => ({
        month,
        value: arr.trend.slice(-sliceCount)[i],
      })),
    [sliceCount]
  );

  const customerTrendSliced = useMemo(
    () => customerGrowth.trend.slice(-sliceCount),
    [sliceCount]
  );

  return (
    <AnimatedSection>
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-sage animate-pulse-soft" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              North Star Metrics
            </h2>
          </div>
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Annual Recurring Revenue"
            value={`$${arr.value}`}
            unit="M"
            change={arr.change}
            subtitle="YoY"
            drilldown={{
              title: "Annual Recurring Revenue",
              description: "Predictable revenue from active subscriptions",
              details: [
                { label: "New ARR (this quarter)", value: "$2.4M" },
                { label: "Expansion ARR", value: "$1.1M" },
                { label: "Churned ARR", value: "-$340K" },
                { label: "Average Contract Value", value: "$41.5K" },
                { label: "Enterprise Contracts", value: "87" },
                { label: "Growth Rate (MoM)", value: "+3.2%" },
              ],
            }}
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
                    animationDuration={600}
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
            drilldown={{
              title: "Net Revenue Retention",
              description: "Revenue retained and expanded from existing customers",
              details: [
                { label: "Gross Retention", value: "94%" },
                { label: "Expansion Revenue", value: "+33%" },
                { label: "Logo Churn Rate", value: "2.1%" },
                { label: "Revenue Churn Rate", value: "1.8%" },
                { label: "Avg. Expansion per Account", value: "$12.4K" },
              ],
            }}
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
            drilldown={{
              title: "Customer Growth Rate",
              description: "Institutional adoption velocity",
              details: [
                { label: "New Customers (Quarter)", value: "48" },
                { label: "Enterprise Tier", value: "12" },
                { label: "Mid-Market Tier", value: "22" },
                { label: "Growth Tier", value: "14" },
                { label: "Pipeline (Qualified)", value: "87" },
                { label: "Win Rate", value: "34%" },
              ],
            }}
          >
            <div className="flex items-end gap-[2px] h-10">
              {customerTrendSliced.map((v, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-sage/30 transition-all hover:bg-sage/60"
                  style={{ height: `${(v / Math.max(...customerTrendSliced)) * 100}%` }}
                />
              ))}
            </div>
          </MetricCard>

          <MetricCard
            label="Cash Runway"
            value={cashRunway.value}
            unit="months"
            subtitle={`$${cashRunway.cashOnHand}M at $${cashRunway.burnRate}M/mo burn`}
            drilldown={{
              title: "Cash Runway",
              description: "Financial sustainability timeline",
              details: [
                { label: "Cash on Hand", value: `$${cashRunway.cashOnHand}M` },
                { label: "Monthly Burn Rate", value: `$${cashRunway.burnRate}M` },
                { label: "Revenue (Monthly)", value: "$1.18M" },
                { label: "Net Burn", value: "$620K" },
                { label: "Last Funding Round", value: "Series B" },
                { label: "Break-even Target", value: "Q3 2027" },
              ],
            }}
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
    </AnimatedSection>
  );
};

export default NorthStarPanel;

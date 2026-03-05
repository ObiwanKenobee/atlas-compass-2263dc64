import { operationalMetrics } from "@/lib/dashboard-data";
import MetricCard from "./MetricCard";
import AnimatedSection from "./AnimatedSection";

const OperationalPanel = () => {
  const { timeToValue, deploymentVelocity, completionRate } = operationalMetrics;

  return (
    <AnimatedSection delay={0.05}>
      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-muted-foreground" />
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Operational Performance
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <MetricCard
            label="Time to Customer Value"
            value={timeToValue.value}
            unit={timeToValue.unit}
            change={timeToValue.change}
            subtitle={`Target: ${timeToValue.target} days`}
            drilldown={{
              title: "Time to Customer Value",
              description: "Duration from onboarding start to first meaningful result",
              details: [
                { label: "Onboarding Phase", value: "3.2 days" },
                { label: "Integration Setup", value: "4.8 days" },
                { label: "First Outcome", value: "4.0 days" },
                { label: "Enterprise Avg.", value: "16 days" },
                { label: "SMB Avg.", value: "7 days" },
              ],
            }}
          >
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-sage transition-all"
                  style={{ width: `${100 - (timeToValue.value / 20) * 100}%` }}
                />
              </div>
            </div>
          </MetricCard>

          <MetricCard
            label="Deployment Velocity"
            value={deploymentVelocity.value}
            unit="releases/week"
            change={deploymentVelocity.change}
            drilldown={{
              title: "Deployment Velocity",
              description: "Engineering release frequency and quality",
              details: [
                { label: "Releases This Week", value: "4" },
                { label: "Hotfixes", value: "1" },
                { label: "Feature Releases", value: "2" },
                { label: "Rollback Rate", value: "1.2%" },
                { label: "Avg. Deploy Time", value: "8 min" },
              ],
            }}
          >
            <div className="flex gap-1">
              {[2.1, 2.4, 2.8, 2.5, 3.0, 2.9, 3.2].map((v, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-cyan/30 transition-all hover:bg-cyan/50"
                  style={{ height: `${(v / 3.5) * 32}px` }}
                />
              ))}
            </div>
          </MetricCard>

          <MetricCard
            label="Project Completion Rate"
            value={completionRate.value}
            unit={completionRate.unit}
            change={completionRate.change}
            drilldown={{
              title: "Project Completion Rate",
              description: "Institutional engagement delivery performance",
              details: [
                { label: "On Schedule", value: "88%" },
                { label: "Slightly Delayed", value: "6%" },
                { label: "At Risk", value: "2%" },
                { label: "Active Projects", value: "34" },
                { label: "Completed This Quarter", value: "12" },
              ],
            }}
          >
            <div className="relative h-1.5 rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-sage transition-all"
                style={{ width: `${completionRate.value}%` }}
              />
            </div>
          </MetricCard>
        </div>
      </section>
    </AnimatedSection>
  );
};

export default OperationalPanel;

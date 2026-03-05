import { productMetrics } from "@/lib/dashboard-data";
import MetricCard from "./MetricCard";

const ProductValuePanel = () => {
  const { activationRate, engagementScore, featureAdoption } = productMetrics;
  const maxUsage = Math.max(...featureAdoption.map((f) => f.usage));

  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-sage" />
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Product Value Indicators
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-1 lg:grid-cols-1">
          <MetricCard
            label="Activation Rate"
            value={activationRate.value}
            unit="%"
            change={activationRate.change}
            subtitle={`Target: ${activationRate.target}%`}
          >
            <div className="h-1.5 rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-sage transition-all"
                style={{ width: `${activationRate.value}%` }}
              />
            </div>
          </MetricCard>

          <MetricCard
            label="Engagement Score"
            value={engagementScore.value}
            unit={`/ ${engagementScore.max}`}
            change={Math.round((engagementScore.change / (engagementScore.value - engagementScore.change)) * 100)}
            subtitle="composite index"
          >
            <div className="flex gap-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-3 flex-1 rounded-sm transition-all ${
                    i < Math.round(engagementScore.value)
                      ? "bg-sage/70"
                      : "bg-secondary"
                  }`}
                />
              ))}
            </div>
          </MetricCard>
        </div>

        {/* Feature Adoption Heatmap */}
        <div className="rounded-lg border border-border bg-card p-5 lg:col-span-2">
          <div className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Feature Adoption
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {featureAdoption.map((feature) => {
              const intensity = feature.usage / maxUsage;
              return (
                <div
                  key={feature.name}
                  className="group relative rounded-md border border-border p-3 transition-all hover:border-sage/30"
                  style={{
                    background: `linear-gradient(135deg, hsl(152, 35%, 52%, ${intensity * 0.15}) 0%, hsl(192, 60%, 50%, ${intensity * 0.08}) 100%)`,
                  }}
                >
                  <div className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground leading-tight">
                    {feature.name}
                  </div>
                  <div className="font-mono text-xl font-medium text-foreground">
                    {feature.usage}%
                  </div>
                  <div className="mt-1 h-1 rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-sage/60 transition-all"
                      style={{ width: `${feature.usage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductValuePanel;

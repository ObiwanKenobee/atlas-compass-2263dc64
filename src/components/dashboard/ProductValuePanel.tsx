import { productMetrics } from "@/lib/dashboard-data";
import MetricCard from "./MetricCard";
import AnimatedSection from "./AnimatedSection";
import { motion } from "framer-motion";

const ProductValuePanel = () => {
  const { activationRate, engagementScore, featureAdoption } = productMetrics;
  const maxUsage = Math.max(...featureAdoption.map((f) => f.usage));

  return (
    <AnimatedSection delay={0.05}>
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
              drilldown={{
                title: "Activation Rate",
                description: "Percentage of new customers reaching first value milestone",
                details: [
                  { label: "First Asset Verification", value: "68%" },
                  { label: "First Simulation Run", value: "54%" },
                  { label: "First Report Generated", value: "82%" },
                  { label: "Median Time to Activate", value: "4.2 days" },
                  { label: "Activation by Enterprise", value: "89%" },
                ],
              }}
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
              drilldown={{
                title: "Customer Engagement Score",
                description: "Composite measure of platform interaction frequency and depth",
                details: [
                  { label: "Data Queries (weekly avg)", value: "2,340" },
                  { label: "Simulations Run", value: "412" },
                  { label: "Reports Downloaded", value: "1,087" },
                  { label: "API Calls (daily avg)", value: "18.4K" },
                  { label: "Active Users (DAU)", value: "1,241" },
                ],
              }}
            >
              <div className="flex gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-3 flex-1 rounded-sm transition-all ${
                      i < Math.round(engagementScore.value) ? "bg-sage/70" : "bg-secondary"
                    }`}
                  />
                ))}
              </div>
            </MetricCard>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 lg:col-span-2">
            <div className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Feature Adoption
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {featureAdoption.map((feature, idx) => {
                const intensity = feature.usage / maxUsage;
                return (
                  <motion.div
                    key={feature.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    whileHover={{ scale: 1.03 }}
                    className="group relative rounded-md border border-border p-3 transition-colors hover:border-sage/30"
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
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
};

export default ProductValuePanel;

import { pipelineData } from "@/lib/dashboard-data";
import AnimatedSection from "./AnimatedSection";
import { motion } from "framer-motion";

const stageColors = [
  "bg-sage",
  "bg-sage/80",
  "bg-cyan",
  "bg-cyan/80",
];

const stageGlows = [
  "shadow-[0_0_12px_-3px_hsl(var(--sage)/0.4)]",
  "shadow-[0_0_12px_-3px_hsl(var(--sage)/0.3)]",
  "shadow-[0_0_12px_-3px_hsl(var(--cyan)/0.3)]",
  "shadow-[0_0_12px_-3px_hsl(var(--cyan)/0.4)]",
];

const RevenuePipelinePanel = () => {
  const { stages, totalValue, avgDealSize, winRate } = pipelineData;
  const maxCount = Math.max(...stages.map((s) => s.count));

  return (
    <AnimatedSection delay={0.05}>
      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-cyan" />
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Revenue Pipeline
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
          {/* Funnel visualization */}
          <div className="rounded-lg border border-border bg-card p-5 lg:col-span-3">
            <div className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Pipeline Funnel
            </div>
            <div className="flex flex-col gap-3">
              {stages.map((stage, i) => {
                const widthPercent = Math.max((stage.count / maxCount) * 100, 20);
                return (
                  <motion.div
                    key={stage.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs text-secondary-foreground">{stage.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-muted-foreground">
                          {stage.count} deals
                        </span>
                        <span className="font-mono text-xs text-foreground">
                          ${stage.value}
                        </span>
                      </div>
                    </div>
                    <div className="relative h-8 w-full rounded bg-secondary/30">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${widthPercent}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className={`h-full rounded ${stageColors[i]} ${stageGlows[i]} flex items-center px-3`}
                        style={{ opacity: 0.7 }}
                      />
                      {i < stages.length - 1 && (
                        <div className="absolute -bottom-3 right-0 text-[10px] font-mono text-muted-foreground">
                          {stage.conversionRate}% →
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Summary stats */}
          <div className="flex flex-col gap-3">
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Total Pipeline</div>
              <div className="mt-1 font-mono text-2xl font-medium text-foreground">{totalValue}</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Avg Deal Size</div>
              <div className="mt-1 font-mono text-2xl font-medium text-foreground">{avgDealSize}</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Win Rate</div>
              <div className="mt-1 font-mono text-2xl font-medium text-sage">{winRate}%</div>
              <div className="mt-2 h-1.5 rounded-full bg-secondary">
                <div className="h-full rounded-full bg-sage" style={{ width: `${winRate}%` }} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
};

export default RevenuePipelinePanel;

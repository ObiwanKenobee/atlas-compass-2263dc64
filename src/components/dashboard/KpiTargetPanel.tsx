import { kpiTargets } from "@/lib/dashboard-data";
import AnimatedSection from "./AnimatedSection";
import { motion } from "framer-motion";

const statusColor = {
  on_track: "text-sage",
  at_risk: "text-amber",
  behind: "text-rose",
};

const statusLabel = {
  on_track: "On Track",
  at_risk: "At Risk",
  behind: "Behind",
};

const ringColor = {
  on_track: "stroke-sage",
  at_risk: "stroke-amber",
  behind: "stroke-rose",
};

const KpiTargetPanel = () => {
  return (
    <AnimatedSection delay={0.05}>
      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-amber" />
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            KPI Target Tracker
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {kpiTargets.map((kpi, i) => {
            const pct = Math.min((kpi.actual / kpi.target) * 100, 100);
            const circumference = 2 * Math.PI * 38;
            const strokeDashoffset = circumference - (pct / 100) * circumference;

            return (
              <motion.div
                key={kpi.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="flex flex-col items-center rounded-lg border border-border bg-card p-4"
              >
                {/* SVG ring gauge */}
                <div className="relative h-20 w-20">
                  <svg viewBox="0 0 88 88" className="h-full w-full -rotate-90">
                    <circle
                      cx="44"
                      cy="44"
                      r="38"
                      fill="none"
                      className="stroke-secondary"
                      strokeWidth="5"
                    />
                    <motion.circle
                      cx="44"
                      cy="44"
                      r="38"
                      fill="none"
                      className={ringColor[kpi.status]}
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      whileInView={{ strokeDashoffset }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.08 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-mono text-lg font-medium text-foreground">
                      {Math.round(pct)}%
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground leading-tight">
                    {kpi.name}
                  </div>
                  <div className="mt-1 font-mono text-xs text-foreground">
                    {kpi.actualFormatted} / {kpi.targetFormatted}
                  </div>
                  <div className={`mt-1 text-[10px] font-medium ${statusColor[kpi.status]}`}>
                    {statusLabel[kpi.status]}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </AnimatedSection>
  );
};

export default KpiTargetPanel;

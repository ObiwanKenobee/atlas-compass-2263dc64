import { useState } from "react";
import { kpiTargets } from "@/lib/dashboard-data";
import AnimatedSection from "./AnimatedSection";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

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

const statusBg = {
  on_track: "bg-sage/10 border-sage/20",
  at_risk: "bg-amber/10 border-amber/20",
  behind: "bg-rose/10 border-rose/20",
};

const chartColorMap: Record<string, string> = {
  on_track: "hsl(152, 35%, 52%)",
  at_risk: "hsl(38, 70%, 55%)",
  behind: "hsl(0, 55%, 55%)",
};

const kpiTrends: Record<string, { month: string; value: number; target: number }[]> = {
  ARR: [
    { month: "Sep", value: 9.4, target: 18 },
    { month: "Oct", value: 10.2, target: 18 },
    { month: "Nov", value: 11.5, target: 18 },
    { month: "Dec", value: 12.1, target: 18 },
    { month: "Jan", value: 12.8, target: 18 },
    { month: "Feb", value: 14.2, target: 18 },
  ],
  NRR: [
    { month: "Sep", value: 118, target: 130 },
    { month: "Oct", value: 120, target: 130 },
    { month: "Nov", value: 122, target: 130 },
    { month: "Dec", value: 124, target: 130 },
    { month: "Jan", value: 125, target: 130 },
    { month: "Feb", value: 127, target: 130 },
  ],
  Activation: [
    { month: "Sep", value: 58, target: 80 },
    { month: "Oct", value: 62, target: 80 },
    { month: "Nov", value: 65, target: 80 },
    { month: "Dec", value: 68, target: 80 },
    { month: "Jan", value: 71, target: 80 },
    { month: "Feb", value: 73, target: 80 },
  ],
  Hectares: [
    { month: "Sep", value: 1.2, target: 3.0 },
    { month: "Oct", value: 1.5, target: 3.0 },
    { month: "Nov", value: 1.7, target: 3.0 },
    { month: "Dec", value: 1.9, target: 3.0 },
    { month: "Jan", value: 2.1, target: 3.0 },
    { month: "Feb", value: 2.4, target: 3.0 },
  ],
  Carbon: [
    { month: "Sep", value: 420, target: 1000 },
    { month: "Oct", value: 520, target: 1000 },
    { month: "Nov", value: 610, target: 1000 },
    { month: "Dec", value: 690, target: 1000 },
    { month: "Jan", value: 760, target: 1000 },
    { month: "Feb", value: 847, target: 1000 },
  ],
  "Win Rate": [
    { month: "Sep", value: 28, target: 40 },
    { month: "Oct", value: 29, target: 40 },
    { month: "Nov", value: 30, target: 40 },
    { month: "Dec", value: 31, target: 40 },
    { month: "Jan", value: 33, target: 40 },
    { month: "Feb", value: 34, target: 40 },
  ],
};

const kpiDetails: Record<string, { description: string; details: { label: string; value: string }[] }> = {
  ARR: {
    description: "Annual Recurring Revenue tracks total contracted recurring revenue.",
    details: [
      { label: "New Business", value: "$4.2M" },
      { label: "Expansion", value: "$3.8M" },
      { label: "Churned", value: "-$1.2M" },
      { label: "Net New ARR", value: "$6.8M" },
      { label: "Growth Rate", value: "34% YoY" },
    ],
  },
  NRR: {
    description: "Net Revenue Retention measures revenue retained from existing customers.",
    details: [
      { label: "Expansion Revenue", value: "$5.1M" },
      { label: "Contraction", value: "-$0.8M" },
      { label: "Churn", value: "-$1.2M" },
      { label: "Industry Benchmark", value: "120%" },
    ],
  },
  Activation: {
    description: "Percentage of new users completing key onboarding actions within 14 days.",
    details: [
      { label: "First Data Upload", value: "91%" },
      { label: "First Report", value: "82%" },
      { label: "API Integration", value: "64%" },
      { label: "Team Invite", value: "58%" },
    ],
  },
  Hectares: {
    description: "Total hectares of land analyzed and verified through the platform.",
    details: [
      { label: "North America", value: "820K" },
      { label: "South America", value: "640K" },
      { label: "Africa", value: "520K" },
      { label: "Southeast Asia", value: "420K" },
    ],
  },
  Carbon: {
    description: "Carbon tons verified through platform's measurement and reporting tools.",
    details: [
      { label: "Sequestered", value: "612K tons" },
      { label: "Avoided", value: "235K tons" },
      { label: "Pending Verification", value: "148K tons" },
    ],
  },
  "Win Rate": {
    description: "Percentage of qualified opportunities that convert to closed-won deals.",
    details: [
      { label: "Avg Sales Cycle", value: "42 days" },
      { label: "Proposals Sent", value: "49" },
      { label: "Deals Won", value: "30" },
      { label: "Deals Lost", value: "19" },
      { label: "Top Loss Reason", value: "Budget timing" },
    ],
  },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="font-mono text-xs text-foreground">
            {p.dataKey === "target" ? "Target" : "Actual"}: {p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const KpiTargetPanel = () => {
  const [selectedKpi, setSelectedKpi] = useState<string | null>(null);

  const selected = kpiTargets.find((k) => k.name === selectedKpi);
  const details = selectedKpi ? kpiDetails[selectedKpi] : null;
  const trendData = selectedKpi ? kpiTrends[selectedKpi] : null;

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
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedKpi(kpi.name)}
                className="flex cursor-pointer flex-col items-center rounded-lg border border-border bg-card p-4 transition-colors hover:border-sage/20 hover:bg-surface-elevated"
              >
                <div className="relative h-20 w-20">
                  <svg viewBox="0 0 88 88" className="h-full w-full -rotate-90">
                    <circle cx="44" cy="44" r="38" fill="none" className="stroke-secondary" strokeWidth="5" />
                    <motion.circle
                      cx="44" cy="44" r="38" fill="none"
                      className={ringColor[kpi.status]}
                      strokeWidth="5" strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      whileInView={{ strokeDashoffset }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.08 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-mono text-lg font-medium text-foreground">{Math.round(pct)}%</span>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground leading-tight">{kpi.name}</div>
                  <div className="mt-1 font-mono text-xs text-foreground">{kpi.actualFormatted} / {kpi.targetFormatted}</div>
                  <div className={`mt-1 text-[10px] font-medium ${statusColor[kpi.status]}`}>{statusLabel[kpi.status]}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Drill-down modal */}
      <AnimatePresence>
        {selected && details && trendData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedKpi(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{selected.name} — Detail Breakdown</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{details.description}</p>
                </div>
                <button
                  onClick={() => setSelectedKpi(null)}
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-4 flex items-center gap-4 rounded-lg bg-secondary/50 p-4">
                <div>
                  <div className="font-mono text-3xl font-medium text-foreground">{selected.actualFormatted}</div>
                  <div className="mt-1 text-xs text-muted-foreground">of {selected.targetFormatted} target</div>
                </div>
                <div className={`rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${statusBg[selected.status]} ${statusColor[selected.status]}`}>
                  {statusLabel[selected.status]}
                </div>
              </div>

              {/* Trend Chart */}
              <div className="mb-4">
                <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">6-Month Trend</div>
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id={`gradient-${selected.name}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={chartColorMap[selected.status]} stopOpacity={0.3} />
                          <stop offset="100%" stopColor={chartColorMap[selected.status]} stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 10, fill: "hsl(215, 12%, 50%)" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: "hsl(215, 12%, 50%)" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="target"
                        stroke="hsl(215, 12%, 50%)"
                        strokeWidth={1}
                        strokeDasharray="4 4"
                        fill="none"
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={chartColorMap[selected.status]}
                        strokeWidth={2}
                        fill={`url(#gradient-${selected.name})`}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-2">
                {details.details.map((d, i) => (
                  <div key={i} className="flex items-center justify-between rounded-md bg-secondary/30 px-3 py-2">
                    <span className="text-xs text-muted-foreground">{d.label}</span>
                    <span className="font-mono text-sm text-foreground">{d.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedSection>
  );
};

export default KpiTargetPanel;

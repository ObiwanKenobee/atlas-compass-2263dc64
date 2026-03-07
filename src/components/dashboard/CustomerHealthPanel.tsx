import { customerHealthData } from "@/lib/dashboard-data";
import AnimatedSection from "./AnimatedSection";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

const riskColors = {
  low: "text-sage",
  medium: "text-amber",
  high: "text-rose",
};

const riskBg = {
  low: "bg-sage/10",
  medium: "bg-amber/10",
  high: "bg-rose/10",
};

const riskBorder = {
  low: "border-sage/20",
  medium: "border-amber/20",
  high: "border-rose/20",
};

const RiskIcon = ({ risk }: { risk: "low" | "medium" | "high" }) => {
  if (risk === "low") return <CheckCircle className="h-3.5 w-3.5 text-sage" />;
  if (risk === "medium") return <AlertTriangle className="h-3.5 w-3.5 text-amber" />;
  return <XCircle className="h-3.5 w-3.5 text-rose" />;
};

const CustomerHealthPanel = () => {
  const { customers, summary } = customerHealthData;

  return (
    <AnimatedSection delay={0.05}>
      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-sage" />
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Customer Health Scores
          </h2>
        </div>

        {/* Summary cards */}
        <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Healthy", value: summary.healthy, color: "text-sage" },
            { label: "At Risk", value: summary.atRisk, color: "text-amber" },
            { label: "Critical", value: summary.critical, color: "text-rose" },
            { label: "Avg NPS", value: summary.avgNps, color: "text-cyan" },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-border bg-card p-4">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{item.label}</div>
              <div className={`mt-1 font-mono text-2xl font-medium ${item.color}`}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Customer table */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          {/* Header */}
          <div className="hidden sm:grid grid-cols-12 gap-2 border-b border-border px-5 py-3">
            <div className="col-span-3 text-[10px] uppercase tracking-widest text-muted-foreground">Customer</div>
            <div className="col-span-2 text-[10px] uppercase tracking-widest text-muted-foreground">Health</div>
            <div className="col-span-2 text-[10px] uppercase tracking-widest text-muted-foreground text-right">NPS</div>
            <div className="col-span-2 text-[10px] uppercase tracking-widest text-muted-foreground text-right">Usage</div>
            <div className="col-span-2 text-[10px] uppercase tracking-widest text-muted-foreground text-right">ARR</div>
            <div className="col-span-1 text-[10px] uppercase tracking-widest text-muted-foreground text-right">Risk</div>
          </div>

          {customers.map((customer, i) => (
            <motion.div
              key={customer.name}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className={`grid grid-cols-2 sm:grid-cols-12 gap-2 px-5 py-3 transition-colors hover:bg-secondary/30 ${
                i !== customers.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="col-span-2 sm:col-span-3">
                <div className="text-sm text-foreground">{customer.name}</div>
                <div className="text-[10px] text-muted-foreground sm:hidden">
                  NPS: {customer.nps} · Usage: {customer.usage}%
                </div>
              </div>
              <div className="hidden sm:flex col-span-2 items-center gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-secondary max-w-[80px]">
                  <div
                    className={`h-full rounded-full transition-all ${
                      customer.healthScore >= 80 ? "bg-sage" : customer.healthScore >= 50 ? "bg-amber" : "bg-rose"
                    }`}
                    style={{ width: `${customer.healthScore}%` }}
                  />
                </div>
                <span className="font-mono text-xs text-muted-foreground">{customer.healthScore}</span>
              </div>
              <div className="hidden sm:flex col-span-2 items-center justify-end">
                <span className={`font-mono text-sm ${customer.nps >= 8 ? "text-sage" : customer.nps >= 6 ? "text-amber" : "text-rose"}`}>
                  {customer.nps}
                </span>
              </div>
              <div className="hidden sm:flex col-span-2 items-center justify-end">
                <span className="font-mono text-sm text-foreground">{customer.usage}%</span>
              </div>
              <div className="hidden sm:flex col-span-2 items-center justify-end">
                <span className="font-mono text-sm text-foreground">{customer.arr}</span>
              </div>
              <div className="flex sm:col-span-1 items-center justify-end">
                <div className={`rounded-full border p-1 ${riskBg[customer.churnRisk]} ${riskBorder[customer.churnRisk]}`}>
                  <RiskIcon risk={customer.churnRisk} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </AnimatedSection>
  );
};

export default CustomerHealthPanel;

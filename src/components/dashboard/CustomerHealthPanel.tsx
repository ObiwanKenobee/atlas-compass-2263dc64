import { useState } from "react";
import { customerHealthData } from "@/lib/dashboard-data";
import AnimatedSection from "./AnimatedSection";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle, XCircle, X } from "lucide-react";

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

// Simulated drill-down details per customer
const customerDetails: Record<string, { lastLogin: string; tickets: number; featureUsage: { name: string; pct: number }[]; renewalDate: string; contractValue: string; csm: string }> = {
  "Nordic Climate Fund": { lastLogin: "2 hours ago", tickets: 1, featureUsage: [{ name: "Asset Verification", pct: 98 }, { name: "Carbon Analytics", pct: 95 }, { name: "Impact Reports", pct: 90 }], renewalDate: "Sep 2026", contractValue: "$2.8M", csm: "Sarah Chen" },
  "Amazon Conservation Corp": { lastLogin: "4 hours ago", tickets: 2, featureUsage: [{ name: "Policy Simulation", pct: 92 }, { name: "Carbon Analytics", pct: 88 }, { name: "Risk Assessment", pct: 80 }], renewalDate: "Nov 2026", contractValue: "$1.9M", csm: "David Park" },
  "EU Green Transition Office": { lastLogin: "1 day ago", tickets: 3, featureUsage: [{ name: "Compliance Tools", pct: 94 }, { name: "Impact Reports", pct: 85 }, { name: "Data Exchange", pct: 72 }], renewalDate: "Jan 2027", contractValue: "$2.1M", csm: "Maria Lopez" },
  "TerraVerde Capital": { lastLogin: "3 days ago", tickets: 5, featureUsage: [{ name: "Portfolio Tracking", pct: 78 }, { name: "Risk Assessment", pct: 65 }, { name: "Carbon Analytics", pct: 54 }], renewalDate: "Jul 2026", contractValue: "$1.4M", csm: "James Wright" },
  "Pacific Reforestation Alliance": { lastLogin: "5 days ago", tickets: 4, featureUsage: [{ name: "Asset Verification", pct: 62 }, { name: "Impact Reports", pct: 48 }, { name: "Data Exchange", pct: 38 }], renewalDate: "Aug 2026", contractValue: "$890K", csm: "Aisha Patel" },
  "Sahel Restoration Initiative": { lastLogin: "12 days ago", tickets: 8, featureUsage: [{ name: "Carbon Analytics", pct: 40 }, { name: "Impact Reports", pct: 30 }, { name: "Compliance Tools", pct: 22 }], renewalDate: "Jun 2026", contractValue: "$620K", csm: "James Wright" },
  "Southeast Asia Carbon Trust": { lastLogin: "15 days ago", tickets: 11, featureUsage: [{ name: "Asset Verification", pct: 35 }, { name: "Carbon Analytics", pct: 25 }, { name: "Policy Simulation", pct: 18 }], renewalDate: "May 2026", contractValue: "$540K", csm: "Aisha Patel" },
  "Cerrado Agricultural Cooperative": { lastLogin: "6 hours ago", tickets: 0, featureUsage: [{ name: "Asset Verification", pct: 96 }, { name: "Carbon Analytics", pct: 92 }, { name: "Compliance Tools", pct: 88 }], renewalDate: "Dec 2026", contractValue: "$1.6M", csm: "Sarah Chen" },
};

const CustomerHealthPanel = () => {
  const { customers, summary } = customerHealthData;
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  const selected = customers.find((c) => c.name === selectedCustomer);
  const details = selectedCustomer ? customerDetails[selectedCustomer] : null;

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
              onClick={() => setSelectedCustomer(customer.name)}
              className={`grid cursor-pointer grid-cols-2 sm:grid-cols-12 gap-2 px-5 py-3 transition-colors hover:bg-secondary/30 ${
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

      {/* Customer drill-down modal */}
      <AnimatePresence>
        {selected && details && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedCustomer(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{selected.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">Customer health deep-dive</p>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Top-level stats */}
              <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg bg-secondary/50 p-3">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Health</div>
                  <div className={`mt-1 font-mono text-xl font-medium ${selected.healthScore >= 80 ? "text-sage" : selected.healthScore >= 50 ? "text-amber" : "text-rose"}`}>
                    {selected.healthScore}
                  </div>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">NPS</div>
                  <div className={`mt-1 font-mono text-xl font-medium ${selected.nps >= 8 ? "text-sage" : selected.nps >= 6 ? "text-amber" : "text-rose"}`}>
                    {selected.nps}
                  </div>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">ARR</div>
                  <div className="mt-1 font-mono text-xl font-medium text-foreground">{selected.arr}</div>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Risk</div>
                  <div className={`mt-1 flex items-center gap-1.5 ${riskColors[selected.churnRisk]}`}>
                    <RiskIcon risk={selected.churnRisk} />
                    <span className="text-sm font-medium capitalize">{selected.churnRisk}</span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between rounded-md bg-secondary/30 px-3 py-2">
                  <span className="text-xs text-muted-foreground">Last Login</span>
                  <span className="font-mono text-sm text-foreground">{details.lastLogin}</span>
                </div>
                <div className="flex items-center justify-between rounded-md bg-secondary/30 px-3 py-2">
                  <span className="text-xs text-muted-foreground">Open Tickets</span>
                  <span className={`font-mono text-sm ${details.tickets > 5 ? "text-rose" : "text-foreground"}`}>{details.tickets}</span>
                </div>
                <div className="flex items-center justify-between rounded-md bg-secondary/30 px-3 py-2">
                  <span className="text-xs text-muted-foreground">Renewal Date</span>
                  <span className="font-mono text-sm text-foreground">{details.renewalDate}</span>
                </div>
                <div className="flex items-center justify-between rounded-md bg-secondary/30 px-3 py-2">
                  <span className="text-xs text-muted-foreground">CSM</span>
                  <span className="text-sm text-foreground">{details.csm}</span>
                </div>
              </div>

              {/* Feature usage bars */}
              <div>
                <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">Feature Usage</div>
                <div className="space-y-2">
                  {details.featureUsage.map((f) => (
                    <div key={f.name}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{f.name}</span>
                        <span className="font-mono text-xs text-foreground">{f.pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary">
                        <div
                          className={`h-full rounded-full ${f.pct >= 70 ? "bg-sage" : f.pct >= 40 ? "bg-amber" : "bg-rose"}`}
                          style={{ width: `${f.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedSection>
  );
};

export default CustomerHealthPanel;

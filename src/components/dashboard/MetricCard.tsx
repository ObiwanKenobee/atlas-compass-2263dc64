import { useState, forwardRef } from "react";
import { TrendingUp, TrendingDown, X, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  change?: number;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
  drilldown?: {
    title: string;
    description: string;
    details: { label: string; value: string }[];
  };
}

const MetricCard = forwardRef<HTMLDivElement, MetricCardProps>(({ label, value, unit, change, subtitle, children, className = "", drilldown }, ref) => {
  const [showDrilldown, setShowDrilldown] = useState(false);
  const isPositive = change !== undefined && change >= 0;

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={drilldown ? { scale: 0.99 } : undefined}
        className={`rounded-lg border border-border bg-card p-5 transition-colors ${
          drilldown ? "cursor-pointer hover:border-sage/20 hover:bg-surface-elevated" : ""
        } ${className}`}
        onClick={() => drilldown && setShowDrilldown(true)}
      >
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {label}
          </span>
          {drilldown && (
            <BarChart3 className="h-3 w-3 text-muted-foreground/50" />
          )}
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-3xl font-medium text-foreground">
            {typeof value === "number" ? value.toLocaleString() : value}
          </span>
          {unit && (
            <span className="text-sm font-medium text-muted-foreground">{unit}</span>
          )}
        </div>
        {change !== undefined && (
          <div className="mt-1.5 flex items-center gap-1">
            {isPositive ? (
              <TrendingUp className="h-3.5 w-3.5 text-sage" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-rose" />
            )}
            <span className={`font-mono text-xs ${isPositive ? "text-sage" : "text-rose"}`}>
              {isPositive ? "+" : ""}{change}%
            </span>
            {subtitle && (
              <span className="text-xs text-muted-foreground">· {subtitle}</span>
            )}
          </div>
        )}
        {change === undefined && subtitle && (
          <div className="mt-1.5 text-xs text-muted-foreground">{subtitle}</div>
        )}
        {children && <div className="mt-3">{children}</div>}
      </motion.div>

      {/* Drill-down Modal */}
      <AnimatePresence>
        {showDrilldown && drilldown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={() => setShowDrilldown(false)}
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
                  <h3 className="text-sm font-semibold text-foreground">{drilldown.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{drilldown.description}</p>
                </div>
                <button
                  onClick={() => setShowDrilldown(false)}
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-4 rounded-lg bg-secondary/50 p-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-4xl font-medium text-foreground">
                    {typeof value === "number" ? value.toLocaleString() : value}
                  </span>
                  {unit && <span className="text-muted-foreground">{unit}</span>}
                </div>
                {change !== undefined && (
                  <div className="mt-2 flex items-center gap-1">
                    {isPositive ? (
                      <TrendingUp className="h-4 w-4 text-sage" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-rose" />
                    )}
                    <span className={`font-mono text-sm ${isPositive ? "text-sage" : "text-rose"}`}>
                      {isPositive ? "+" : ""}{change}%
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {drilldown.details.map((detail, i) => (
                  <div key={i} className="flex items-center justify-between rounded-md bg-secondary/30 px-3 py-2">
                    <span className="text-xs text-muted-foreground">{detail.label}</span>
                    <span className="font-mono text-sm text-foreground">{detail.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

MetricCard.displayName = "MetricCard";

export default MetricCard;

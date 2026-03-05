import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  change?: number;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}

const MetricCard = ({ label, value, unit, change, subtitle, children, className = "" }: MetricCardProps) => {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className={`rounded-lg border border-border bg-card p-5 ${className}`}>
      <div className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
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
      {!change && subtitle && (
        <div className="mt-1.5 text-xs text-muted-foreground">{subtitle}</div>
      )}
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
};

export default MetricCard;

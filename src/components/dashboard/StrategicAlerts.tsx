import { strategicAlerts } from "@/lib/dashboard-data";
import { FileText, Handshake, Leaf, ArrowRightLeft } from "lucide-react";

const iconMap = {
  contract: FileText,
  partnership: Handshake,
  ecosystem: Leaf,
  transaction: ArrowRightLeft,
};

const colorMap = {
  contract: "text-sage",
  partnership: "text-cyan",
  ecosystem: "text-amber",
  transaction: "text-sage",
};

const StrategicAlerts = () => {
  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-amber animate-pulse-soft" />
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Strategic Alerts & Insights
        </h2>
      </div>
      <div className="rounded-lg border border-border bg-card">
        {strategicAlerts.map((alert, i) => {
          const Icon = iconMap[alert.type];
          return (
            <div
              key={i}
              className={`flex items-start gap-4 px-5 py-4 transition-colors hover:bg-secondary/30 ${
                i !== strategicAlerts.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${colorMap[alert.type]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{alert.title}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-mono text-xs text-sage">{alert.value}</span>
                  <span className="text-xs text-muted-foreground">· {alert.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default StrategicAlerts;

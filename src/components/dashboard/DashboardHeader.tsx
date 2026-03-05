import { Activity } from "lucide-react";

const DashboardHeader = () => {
  const now = new Date();
  const formatted = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4 lg:px-8">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sage/10">
          <Activity className="h-4 w-4 text-sage" />
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-tight text-foreground">
            Atlas Sanctum
          </h1>
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
            Executive Dashboard
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 sm:flex">
          <div className="h-1.5 w-1.5 rounded-full bg-sage animate-pulse-soft" />
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Live
          </span>
        </div>
        <span className="text-xs text-muted-foreground">{formatted}</span>
      </div>
    </header>
  );
};

export default DashboardHeader;

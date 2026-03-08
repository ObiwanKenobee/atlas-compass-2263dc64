import { useState, useEffect, useRef } from "react";
import { Bell, X, Check, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface AlertItem {
  id: string;
  title: string;
  value: string;
  alert_type: string;
  created_at: string;
  acknowledged: boolean;
}

const NotificationInbox = () => {
  const [open, setOpen] = useState(false);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAlerts();

    const channel = supabase
      .channel("notification-inbox")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "strategic_alerts" }, (payload) => {
        const newAlert = payload.new as any;
        setAlerts((prev) => [{ ...newAlert, acknowledged: false }, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchAlerts = async () => {
    const { data } = await supabase
      .from("strategic_alerts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setAlerts(data.map((a) => ({ ...a, acknowledged: false })));
  };

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set(prev).add(id));
  };

  const handleAcknowledge = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
  };

  const handleDismissAll = () => {
    setDismissed(new Set(alerts.map((a) => a.id)));
  };

  const visibleAlerts = alerts.filter((a) => !dismissed.has(a.id));
  const unacknowledgedCount = visibleAlerts.filter((a) => !a.acknowledged).length;

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const typeIcon = (type: string) => {
    if (type === "kpi_breach" || type === "warning") return <AlertTriangle className="h-3 w-3 text-amber" />;
    return <Bell className="h-3 w-3 text-cyan" />;
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unacknowledgedCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose px-1 text-[9px] font-medium text-primary-foreground">
            {unacknowledgedCount > 9 ? "9+" : unacknowledgedCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-10 z-50 w-80 sm:w-96 rounded-xl border border-border bg-card shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground">Notifications</h3>
                {unacknowledgedCount > 0 && (
                  <span className="rounded-full bg-rose/10 px-1.5 py-0.5 text-[10px] font-medium text-rose">
                    {unacknowledgedCount}
                  </span>
                )}
              </div>
              <button
                onClick={handleDismissAll}
                className="text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                Clear all
              </button>
            </div>

            {/* Alert list */}
            <div className="max-h-80 overflow-y-auto">
              {visibleAlerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Bell className="mb-2 h-5 w-5 opacity-40" />
                  <span className="text-xs">No notifications</span>
                </div>
              ) : (
                visibleAlerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10, height: 0 }}
                    className={`group flex items-start gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-secondary/30 ${
                      alert.acknowledged ? "opacity-60" : ""
                    }`}
                  >
                    <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-secondary">
                      {typeIcon(alert.alert_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-foreground leading-snug line-clamp-2">{alert.title}</div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="font-mono text-[10px] text-muted-foreground">{alert.value}</span>
                        <span className="text-[10px] text-muted-foreground">·</span>
                        <span className="text-[10px] text-muted-foreground">{formatTime(alert.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      {!alert.acknowledged && (
                        <button
                          onClick={() => handleAcknowledge(alert.id)}
                          className="rounded p-1 text-muted-foreground transition-colors hover:bg-sage/10 hover:text-sage"
                          title="Acknowledge"
                        >
                          <Check className="h-3 w-3" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDismiss(alert.id)}
                        className="rounded p-1 text-muted-foreground transition-colors hover:bg-rose/10 hover:text-rose"
                        title="Dismiss"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationInbox;

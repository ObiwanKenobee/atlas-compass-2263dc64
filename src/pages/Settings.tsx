import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Activity, ArrowLeft, Save, Bell, Target } from "lucide-react";
import { toast } from "sonner";

interface ThresholdConfig {
  metric_key: string;
  label: string;
  threshold: number;
  enabled: boolean;
}

const defaultThresholds: ThresholdConfig[] = [
  { metric_key: "arr", label: "ARR", threshold: 75, enabled: true },
  { metric_key: "nrr", label: "Net Revenue Retention", threshold: 80, enabled: true },
  { metric_key: "activation_rate", label: "Activation Rate", threshold: 70, enabled: true },
  { metric_key: "hectares_analyzed", label: "Hectares Analyzed", threshold: 75, enabled: false },
  { metric_key: "carbon_verified", label: "Carbon Verified", threshold: 75, enabled: false },
  { metric_key: "win_rate", label: "Win Rate", threshold: 70, enabled: true },
];

const SettingsPage = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [thresholds, setThresholds] = useState<ThresholdConfig[]>(defaultThresholds);
  const [saving, setSaving] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyDashboard, setNotifyDashboard] = useState(true);
  const [checkFrequency, setCheckFrequency] = useState("hourly");

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!loading && user && !isAdmin) navigate("/");
  }, [loading, user, isAdmin, navigate]);

  // Load saved settings from metadata in dashboard_metrics or localStorage
  useEffect(() => {
    const saved = localStorage.getItem("kpi_alert_settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.thresholds) setThresholds(parsed.thresholds);
        if (parsed.notifyEmail !== undefined) setNotifyEmail(parsed.notifyEmail);
        if (parsed.notifyDashboard !== undefined) setNotifyDashboard(parsed.notifyDashboard);
        if (parsed.checkFrequency) setCheckFrequency(parsed.checkFrequency);
      } catch {}
    }
  }, []);

  const handleThresholdChange = (key: string, field: "threshold" | "enabled", value: number | boolean) => {
    setThresholds((prev) =>
      prev.map((t) => (t.metric_key === key ? { ...t, [field]: value } : t))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    const settings = { thresholds, notifyEmail, notifyDashboard, checkFrequency };
    localStorage.setItem("kpi_alert_settings", JSON.stringify(settings));

    // Also store in dashboard_metrics metadata for the edge function to read
    try {
      await supabase.from("dashboard_metrics").upsert({
        metric_key: "_alert_config",
        metric_value: 0,
        metadata: settings as any,
      }, { onConflict: "metric_key" });
      toast.success("Alert settings saved successfully");
    } catch {
      toast.error("Failed to save settings to backend");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-3 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-amber/10">
              <Target className="h-4 w-4 text-amber" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-foreground">Alert Settings</h1>
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                KPI Thresholds & Notifications
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{user?.email}</span>
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <ArrowLeft className="h-3 w-3" /> Admin
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[900px] px-6 py-8 lg:px-8 space-y-8">
        {/* Notification Preferences */}
        <section>
          <div className="mb-4 flex items-center gap-3">
            <Bell className="h-4 w-4 text-amber" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Notification Preferences
            </h2>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <div className="text-sm text-foreground">Dashboard Alerts</div>
                <div className="text-xs text-muted-foreground">Show alerts in the strategic alerts feed</div>
              </div>
              <button
                onClick={() => setNotifyDashboard(!notifyDashboard)}
                className={`relative h-6 w-11 rounded-full transition-colors ${notifyDashboard ? "bg-sage" : "bg-secondary"}`}
              >
                <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-card border border-border shadow transition-transform ${notifyDashboard ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </label>

            <label className="flex items-center justify-between">
              <div>
                <div className="text-sm text-foreground">Email Notifications</div>
                <div className="text-xs text-muted-foreground">Send email when KPIs breach thresholds</div>
              </div>
              <button
                onClick={() => setNotifyEmail(!notifyEmail)}
                className={`relative h-6 w-11 rounded-full transition-colors ${notifyEmail ? "bg-sage" : "bg-secondary"}`}
              >
                <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-card border border-border shadow transition-transform ${notifyEmail ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </label>

            <div>
              <div className="mb-2 text-sm text-foreground">Check Frequency</div>
              <div className="flex gap-2">
                {["hourly", "daily", "weekly"].map((freq) => (
                  <button
                    key={freq}
                    onClick={() => setCheckFrequency(freq)}
                    className={`rounded-md border px-3 py-1.5 text-xs capitalize transition-colors ${
                      checkFrequency === freq
                        ? "border-sage bg-sage/10 text-sage"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* KPI Thresholds */}
        <section>
          <div className="mb-4 flex items-center gap-3">
            <Target className="h-4 w-4 text-cyan" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Alert Thresholds
            </h2>
            <span className="text-[10px] text-muted-foreground">(% of target to trigger alert)</span>
          </div>

          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="hidden sm:grid grid-cols-12 gap-2 border-b border-border px-5 py-3">
              <div className="col-span-4 text-[10px] uppercase tracking-widest text-muted-foreground">Metric</div>
              <div className="col-span-4 text-[10px] uppercase tracking-widest text-muted-foreground">Threshold</div>
              <div className="col-span-2 text-[10px] uppercase tracking-widest text-muted-foreground text-center">Enabled</div>
              <div className="col-span-2 text-[10px] uppercase tracking-widest text-muted-foreground text-right">Preview</div>
            </div>

            {thresholds.map((t) => (
              <motion.div
                key={t.metric_key}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2 border-b border-border px-5 py-3 last:border-0 items-center"
              >
                <div className="sm:col-span-4">
                  <span className="text-sm text-foreground">{t.label}</span>
                </div>
                <div className="sm:col-span-4 flex items-center gap-3">
                  <input
                    type="range"
                    min="50"
                    max="95"
                    step="5"
                    value={t.threshold}
                    onChange={(e) => handleThresholdChange(t.metric_key, "threshold", Number(e.target.value))}
                    className="flex-1 accent-sage"
                    disabled={!t.enabled}
                  />
                  <span className={`font-mono text-sm w-10 text-right ${t.enabled ? "text-foreground" : "text-muted-foreground"}`}>
                    {t.threshold}%
                  </span>
                </div>
                <div className="sm:col-span-2 flex justify-center">
                  <button
                    onClick={() => handleThresholdChange(t.metric_key, "enabled", !t.enabled)}
                    className={`relative h-5 w-9 rounded-full transition-colors ${t.enabled ? "bg-sage" : "bg-secondary"}`}
                  >
                    <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-card border border-border shadow transition-transform ${t.enabled ? "translate-x-4" : "translate-x-0.5"}`} />
                  </button>
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    t.enabled
                      ? "bg-amber/10 text-amber border border-amber/20"
                      : "bg-secondary text-muted-foreground"
                  }`}>
                    {t.enabled ? `Alert < ${t.threshold}%` : "Disabled"}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-md bg-sage px-4 py-2 text-xs font-medium uppercase tracking-wider text-primary-foreground transition-colors hover:bg-sage/90 disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;

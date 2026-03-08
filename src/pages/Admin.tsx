import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Activity, ArrowLeft, Save, Plus, Trash2, Settings } from "lucide-react";

interface MetricRow {
  id: string;
  metric_key: string;
  metric_value: number;
  metric_unit: string | null;
  change_percent: number | null;
}

const AdminPage = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<MetricRow[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!loading && user && !isAdmin) navigate("/");
  }, [loading, user, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) fetchMetrics();
  }, [isAdmin]);

  const fetchMetrics = async () => {
    const { data } = await supabase
      .from("dashboard_metrics")
      .select("id, metric_key, metric_value, metric_unit, change_percent")
      .order("metric_key");
    if (data) setMetrics(data);
    setLoadingMetrics(false);
  };

  const updateMetric = async (metric: MetricRow) => {
    setSaving(metric.id);
    await supabase
      .from("dashboard_metrics")
      .update({
        metric_value: metric.metric_value,
        metric_unit: metric.metric_unit,
        change_percent: metric.change_percent,
      })
      .eq("id", metric.id);
    setSaving(null);
  };

  const handleFieldChange = (id: string, field: keyof MetricRow, value: string) => {
    setMetrics((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              [field]: field === "metric_unit" ? value : value === "" ? null : Number(value),
            }
          : m
      )
    );
  };

  if (loading || loadingMetrics) {
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
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sage/10">
              <Activity className="h-4 w-4 text-sage" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-foreground">Admin Panel</h1>
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                Metric Management
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{user?.email}</span>
            <button
              onClick={() => navigate("/settings")}
              className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Settings className="h-3 w-3" /> Settings
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <ArrowLeft className="h-3 w-3" /> Dashboard
            </button>
            <button
              onClick={signOut}
              className="rounded-md bg-secondary px-2.5 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-6 py-8 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Dashboard Metrics
          </h2>
        </div>

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="hidden sm:grid grid-cols-12 gap-2 border-b border-border px-5 py-3">
            <div className="col-span-3 text-[10px] uppercase tracking-widest text-muted-foreground">Key</div>
            <div className="col-span-3 text-[10px] uppercase tracking-widest text-muted-foreground">Value</div>
            <div className="col-span-2 text-[10px] uppercase tracking-widest text-muted-foreground">Unit</div>
            <div className="col-span-2 text-[10px] uppercase tracking-widest text-muted-foreground">Change %</div>
            <div className="col-span-2 text-[10px] uppercase tracking-widest text-muted-foreground text-right">Actions</div>
          </div>

          {metrics.map((metric) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-12 gap-2 border-b border-border px-5 py-3 last:border-0"
            >
              <div className="sm:col-span-3 flex items-center">
                <span className="font-mono text-sm text-foreground">{metric.metric_key}</span>
              </div>
              <div className="sm:col-span-3">
                <input
                  type="number"
                  step="any"
                  value={metric.metric_value}
                  onChange={(e) => handleFieldChange(metric.id, "metric_value", e.target.value)}
                  className="w-full rounded border border-border bg-secondary/50 px-2 py-1.5 font-mono text-sm text-foreground focus:border-sage focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <input
                  type="text"
                  value={metric.metric_unit ?? ""}
                  onChange={(e) => handleFieldChange(metric.id, "metric_unit", e.target.value)}
                  className="w-full rounded border border-border bg-secondary/50 px-2 py-1.5 font-mono text-sm text-foreground focus:border-sage focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <input
                  type="number"
                  step="any"
                  value={metric.change_percent ?? ""}
                  onChange={(e) => handleFieldChange(metric.id, "change_percent", e.target.value)}
                  className="w-full rounded border border-border bg-secondary/50 px-2 py-1.5 font-mono text-sm text-foreground focus:border-sage focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2 flex items-center justify-end">
                <button
                  onClick={() => updateMetric(metric)}
                  disabled={saving === metric.id}
                  className="flex items-center gap-1 rounded-md bg-sage/10 px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wider text-sage transition-colors hover:bg-sage/20 disabled:opacity-50"
                >
                  <Save className="h-3 w-3" />
                  {saving === metric.id ? "..." : "Save"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;

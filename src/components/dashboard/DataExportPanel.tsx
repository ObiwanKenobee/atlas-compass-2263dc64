import { useState } from "react";
import { Download, FileText, Table2 } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { motion } from "framer-motion";
import {
  northStarMetrics,
  ecosystemMetrics,
  operationalMetrics,
  pipelineData,
  kpiTargets,
} from "@/lib/dashboard-data";

type ExportFormat = "csv" | "json";

const sections = [
  { key: "north_star", label: "North Star Metrics" },
  { key: "ecosystem", label: "Ecosystem Impact" },
  { key: "operational", label: "Operational Performance" },
  { key: "pipeline", label: "Revenue Pipeline" },
  { key: "kpi_targets", label: "KPI Targets" },
] as const;

function generateCsv(sectionKey: string): string {
  switch (sectionKey) {
    case "north_star":
      return [
        "Metric,Value,Unit,Change %",
        `ARR,${northStarMetrics.arr.value},${northStarMetrics.arr.unit},${northStarMetrics.arr.change}`,
        `NRR,${northStarMetrics.nrr.value},${northStarMetrics.nrr.unit},${northStarMetrics.nrr.change}`,
        `Customer Growth,${northStarMetrics.customerGrowth.value},${northStarMetrics.customerGrowth.unit},${northStarMetrics.customerGrowth.change}`,
        `Cash Runway,${northStarMetrics.cashRunway.value},${northStarMetrics.cashRunway.unit},`,
      ].join("\n");
    case "ecosystem":
      return [
        "Month,Hectares (M),Carbon (K tons),Projects",
        ...ecosystemMetrics.monthlyTrend.map(
          (r) => `${r.month},${r.hectares},${r.carbon},${r.projects}`
        ),
      ].join("\n");
    case "operational":
      return [
        "Metric,Value,Unit,Change %",
        `Time to Value,${operationalMetrics.timeToValue.value},${operationalMetrics.timeToValue.unit},${operationalMetrics.timeToValue.change}`,
        `Deployment Velocity,${operationalMetrics.deploymentVelocity.value},${operationalMetrics.deploymentVelocity.unit},${operationalMetrics.deploymentVelocity.change}`,
        `Completion Rate,${operationalMetrics.completionRate.value},${operationalMetrics.completionRate.unit},${operationalMetrics.completionRate.change}`,
      ].join("\n");
    case "pipeline":
      return [
        "Stage,Deals,Value,Conversion %",
        ...pipelineData.stages.map(
          (s) => `${s.name},${s.count},${s.value},${s.conversionRate ?? ""}`
        ),
      ].join("\n");
    case "kpi_targets":
      return [
        "KPI,Actual,Target,Status",
        ...kpiTargets.map(
          (k) => `${k.name},${k.actualFormatted},${k.targetFormatted},${k.status}`
        ),
      ].join("\n");
    default:
      return "";
  }
}

function generateJson(sectionKey: string): string {
  switch (sectionKey) {
    case "north_star":
      return JSON.stringify(northStarMetrics, null, 2);
    case "ecosystem":
      return JSON.stringify(ecosystemMetrics, null, 2);
    case "operational":
      return JSON.stringify(operationalMetrics, null, 2);
    case "pipeline":
      return JSON.stringify(pipelineData, null, 2);
    case "kpi_targets":
      return JSON.stringify(kpiTargets, null, 2);
    default:
      return "{}";
  }
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const DataExportPanel = () => {
  const [exportFormat, setExportFormat] = useState<ExportFormat>("csv");

  const handleExport = (sectionKey: string, label: string) => {
    const timestamp = new Date().toISOString().slice(0, 10);
    if (exportFormat === "csv") {
      downloadFile(generateCsv(sectionKey), `atlas-${sectionKey}-${timestamp}.csv`, "text/csv");
    } else {
      downloadFile(generateJson(sectionKey), `atlas-${sectionKey}-${timestamp}.json`, "application/json");
    }
  };

  const handleExportAll = () => {
    const timestamp = new Date().toISOString().slice(0, 10);
    sections.forEach(({ key }) => {
      if (exportFormat === "csv") {
        downloadFile(generateCsv(key), `atlas-${key}-${timestamp}.csv`, "text/csv");
      } else {
        downloadFile(generateJson(key), `atlas-${key}-${timestamp}.json`, "application/json");
      }
    });
  };

  return (
    <AnimatedSection delay={0.05}>
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-muted-foreground" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Data Export & Reporting
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-md bg-secondary/50 p-0.5">
              <button
                onClick={() => setExportFormat("csv")}
                className={`flex items-center gap-1 rounded-sm px-2.5 py-1 font-mono text-[10px] tracking-wider transition-all ${
                  exportFormat === "csv"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Table2 className="h-3 w-3" />
                CSV
              </button>
              <button
                onClick={() => setExportFormat("json")}
                className={`flex items-center gap-1 rounded-sm px-2.5 py-1 font-mono text-[10px] tracking-wider transition-all ${
                  exportFormat === "json"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileText className="h-3 w-3" />
                JSON
              </button>
            </div>
            <button
              onClick={handleExportAll}
              className="flex items-center gap-1.5 rounded-md bg-sage/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-sage transition-colors hover:bg-sage/20"
            >
              <Download className="h-3 w-3" />
              Export All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {sections.map(({ key, label }, i) => (
            <motion.button
              key={key}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleExport(key, label)}
              className="flex items-center justify-between rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-sage/20 hover:bg-surface-elevated"
            >
              <div>
                <div className="text-xs text-foreground">{label}</div>
                <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                  .{exportFormat}
                </div>
              </div>
              <Download className="h-4 w-4 text-muted-foreground" />
            </motion.button>
          ))}
        </div>
      </section>
    </AnimatedSection>
  );
};

export default DataExportPanel;

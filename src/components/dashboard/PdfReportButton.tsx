import { useState } from "react";
import { FileDown } from "lucide-react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  northStarMetrics,
  ecosystemMetrics,
  operationalMetrics,
  pipelineData,
  kpiTargets,
  customerHealthData,
} from "@/lib/dashboard-data";

function generatePdf() {
  const doc = new jsPDF();
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Title
  doc.setFontSize(20);
  doc.setTextColor(45, 106, 79); // sage
  doc.text("Atlas Sanctum — Executive Report", 14, 22);
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text(dateStr, 14, 30);

  let y = 40;

  // North Star Metrics
  doc.setFontSize(13);
  doc.setTextColor(30, 30, 30);
  doc.text("North Star Metrics", 14, y);
  y += 4;
  autoTable(doc, {
    startY: y,
    head: [["Metric", "Value", "Change"]],
    body: [
      ["ARR", `$${northStarMetrics.arr.value}M`, `+${northStarMetrics.arr.change}%`],
      ["NRR", `${northStarMetrics.nrr.value}%`, `+${northStarMetrics.nrr.change}%`],
      ["Customer Growth", `${northStarMetrics.customerGrowth.value}% QoQ`, `+${northStarMetrics.customerGrowth.change}%`],
      ["Cash Runway", `${northStarMetrics.cashRunway.value} months`, `$${northStarMetrics.cashRunway.cashOnHand}M on hand`],
    ],
    theme: "grid",
    headStyles: { fillColor: [45, 106, 79] },
    styles: { fontSize: 9 },
  });
  y = (doc as any).lastAutoTable.finalY + 12;

  // KPI Targets
  doc.setFontSize(13);
  doc.text("KPI Target Tracking", 14, y);
  y += 4;
  autoTable(doc, {
    startY: y,
    head: [["KPI", "Actual", "Target", "Status"]],
    body: kpiTargets.map((k) => [
      k.name,
      k.actualFormatted,
      k.targetFormatted,
      k.status.replace("_", " ").toUpperCase(),
    ]),
    theme: "grid",
    headStyles: { fillColor: [45, 106, 79] },
    styles: { fontSize: 9 },
  });
  y = (doc as any).lastAutoTable.finalY + 12;

  // Revenue Pipeline
  doc.setFontSize(13);
  doc.text("Revenue Pipeline", 14, y);
  y += 4;
  autoTable(doc, {
    startY: y,
    head: [["Stage", "Deals", "Value", "Conversion"]],
    body: pipelineData.stages.map((s) => [
      s.name,
      String(s.count),
      s.value,
      s.conversionRate ? `${s.conversionRate}%` : "—",
    ]),
    theme: "grid",
    headStyles: { fillColor: [45, 106, 79] },
    styles: { fontSize: 9 },
  });
  y = (doc as any).lastAutoTable.finalY + 12;

  // Check page break
  if (y > 230) {
    doc.addPage();
    y = 20;
  }

  // Ecosystem Impact
  doc.setFontSize(13);
  doc.text("Ecosystem Impact", 14, y);
  y += 4;
  autoTable(doc, {
    startY: y,
    head: [["Metric", "Value", "Change"]],
    body: [
      ["Hectares Analyzed", `${ecosystemMetrics.hectaresAnalyzed.value}M`, `+${ecosystemMetrics.hectaresAnalyzed.change}%`],
      ["Carbon Verified", `${ecosystemMetrics.carbonVerified.value}K tons`, `+${ecosystemMetrics.carbonVerified.change}%`],
      ["Projects Validated", String(ecosystemMetrics.projectsValidated.value), `+${ecosystemMetrics.projectsValidated.change}%`],
      ["Assets Traded", `$${ecosystemMetrics.assetsTraded.value}M`, `+${ecosystemMetrics.assetsTraded.change}%`],
    ],
    theme: "grid",
    headStyles: { fillColor: [45, 106, 79] },
    styles: { fontSize: 9 },
  });
  y = (doc as any).lastAutoTable.finalY + 12;

  if (y > 230) {
    doc.addPage();
    y = 20;
  }

  // Customer Health
  doc.setFontSize(13);
  doc.text("Customer Health", 14, y);
  y += 4;
  autoTable(doc, {
    startY: y,
    head: [["Customer", "Health", "NPS", "Usage %", "ARR", "Risk"]],
    body: customerHealthData.customers.map((c) => [
      c.name,
      String(c.healthScore),
      String(c.nps),
      `${c.usage}%`,
      c.arr,
      c.churnRisk.toUpperCase(),
    ]),
    theme: "grid",
    headStyles: { fillColor: [45, 106, 79] },
    styles: { fontSize: 8 },
  });
  y = (doc as any).lastAutoTable.finalY + 12;

  if (y > 230) {
    doc.addPage();
    y = 20;
  }

  // Operational
  doc.setFontSize(13);
  doc.text("Operational Performance", 14, y);
  y += 4;
  autoTable(doc, {
    startY: y,
    head: [["Metric", "Value", "Change"]],
    body: [
      ["Time to Value", `${operationalMetrics.timeToValue.value} days`, `${operationalMetrics.timeToValue.change}%`],
      ["Deployment Velocity", `${operationalMetrics.deploymentVelocity.value}/week`, `+${operationalMetrics.deploymentVelocity.change}%`],
      ["Completion Rate", `${operationalMetrics.completionRate.value}%`, `+${operationalMetrics.completionRate.change}%`],
    ],
    theme: "grid",
    headStyles: { fillColor: [45, 106, 79] },
    styles: { fontSize: 9 },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Atlas Sanctum — Confidential — Page ${i} of ${pageCount}`, 14, 287);
  }

  doc.save(`atlas-sanctum-report-${now.toISOString().slice(0, 10)}.pdf`);
}

const PdfReportButton = () => {
  const [generating, setGenerating] = useState(false);

  const handleClick = async () => {
    setGenerating(true);
    // Small delay for UI feedback
    await new Promise((r) => setTimeout(r, 200));
    generatePdf();
    setGenerating(false);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      disabled={generating}
      className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-xs font-medium text-foreground transition-colors hover:border-sage/30 hover:bg-surface-elevated disabled:opacity-50"
    >
      <FileDown className={`h-4 w-4 text-sage ${generating ? "animate-bounce" : ""}`} />
      {generating ? "Generating…" : "Download PDF Report"}
    </motion.button>
  );
};

export default PdfReportButton;

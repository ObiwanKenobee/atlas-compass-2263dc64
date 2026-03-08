import { useRealtimeDashboard } from "@/hooks/use-realtime-dashboard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ExecutiveBriefingPanel from "@/components/dashboard/ExecutiveBriefingPanel";
import NorthStarPanel from "@/components/dashboard/NorthStarPanel";
import MarketAdoptionPanel from "@/components/dashboard/MarketAdoptionPanel";
import ProductValuePanel from "@/components/dashboard/ProductValuePanel";
import EcosystemPanel from "@/components/dashboard/EcosystemPanel";
import OperationalPanel from "@/components/dashboard/OperationalPanel";
import StrategicAlerts from "@/components/dashboard/StrategicAlerts";
import RevenuePipelinePanel from "@/components/dashboard/RevenuePipelinePanel";
import CustomerHealthPanel from "@/components/dashboard/CustomerHealthPanel";
import KpiTargetPanel from "@/components/dashboard/KpiTargetPanel";
import DataExportPanel from "@/components/dashboard/DataExportPanel";

const Index = () => {
  useRealtimeDashboard();

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="mx-auto max-w-[1440px] space-y-8 px-6 py-8 lg:px-8">
        <NorthStarPanel />
        <KpiTargetPanel />
        <RevenuePipelinePanel />
        <MarketAdoptionPanel />
        <ProductValuePanel />
        <CustomerHealthPanel />
        <EcosystemPanel />
        <OperationalPanel />
        <StrategicAlerts />
        <DataExportPanel />
      </main>
    </div>
  );
};

export default Index;

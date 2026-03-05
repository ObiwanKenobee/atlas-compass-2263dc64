import DashboardHeader from "@/components/dashboard/DashboardHeader";
import NorthStarPanel from "@/components/dashboard/NorthStarPanel";
import MarketAdoptionPanel from "@/components/dashboard/MarketAdoptionPanel";
import ProductValuePanel from "@/components/dashboard/ProductValuePanel";
import EcosystemPanel from "@/components/dashboard/EcosystemPanel";
import OperationalPanel from "@/components/dashboard/OperationalPanel";
import StrategicAlerts from "@/components/dashboard/StrategicAlerts";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="mx-auto max-w-[1440px] space-y-8 px-6 py-8 lg:px-8">
        <NorthStarPanel />
        <MarketAdoptionPanel />
        <ProductValuePanel />
        <EcosystemPanel />
        <OperationalPanel />
        <StrategicAlerts />
      </main>
    </div>
  );
};

export default Index;

// Mock data for the Atlas Sanctum Executive Dashboard

export const northStarMetrics = {
  arr: {
    value: 14.2,
    unit: "M",
    change: 34,
    trend: [3.2, 4.1, 5.0, 5.8, 6.9, 7.8, 8.5, 9.4, 10.2, 11.5, 12.8, 14.2],
    months: ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"],
  },
  nrr: {
    value: 127,
    unit: "%",
    change: 8,
    benchmark: 120,
  },
  customerGrowth: {
    value: 48,
    unit: "%",
    change: 12,
    totalCustomers: 342,
    trend: [180, 195, 210, 228, 245, 260, 278, 290, 305, 318, 330, 342],
  },
  cashRunway: {
    value: 28,
    unit: "months",
    burnRate: 1.8,
    cashOnHand: 50.4,
  },
};

export const marketAdoption = {
  regions: [
    { name: "North America", partners: 87, projects: 234, lat: 40, lng: -100, intensity: 0.9 },
    { name: "Europe", partners: 64, projects: 178, lat: 50, lng: 10, intensity: 0.75 },
    { name: "Southeast Asia", partners: 38, projects: 95, lat: 5, lng: 110, intensity: 0.5 },
    { name: "East Africa", partners: 29, projects: 72, lat: 0, lng: 37, intensity: 0.4 },
    { name: "South America", partners: 24, projects: 58, lat: -15, lng: -55, intensity: 0.35 },
    { name: "Oceania", partners: 18, projects: 41, lat: -25, lng: 135, intensity: 0.25 },
    { name: "South Asia", partners: 22, projects: 53, lat: 22, lng: 78, intensity: 0.3 },
    { name: "West Africa", partners: 15, projects: 34, lat: 8, lng: -5, intensity: 0.2 },
  ],
  sectors: [
    { name: "Climate Funds", value: 89, color: "sage" },
    { name: "Government", value: 72, color: "cyan" },
    { name: "Corporations", value: 65, color: "sage" },
    { name: "NGOs", value: 54, color: "cyan" },
    { name: "Research", value: 42, color: "sage" },
    { name: "Agriculture", value: 38, color: "cyan" },
  ],
};

export const productMetrics = {
  activationRate: {
    value: 73,
    change: 5,
    target: 80,
  },
  engagementScore: {
    value: 8.2,
    max: 10,
    change: 0.6,
  },
  featureAdoption: [
    { name: "Asset Verification", usage: 92 },
    { name: "Policy Simulation", usage: 78 },
    { name: "Carbon Analytics", usage: 85 },
    { name: "Risk Assessment", usage: 71 },
    { name: "Impact Reports", usage: 88 },
    { name: "Data Exchange", usage: 64 },
    { name: "Portfolio Tracking", usage: 76 },
    { name: "Compliance Tools", usage: 59 },
  ],
};

export const ecosystemMetrics = {
  hectaresAnalyzed: { value: 2.4, unit: "M", change: 18 },
  carbonVerified: { value: 847, unit: "K tons", change: 24 },
  projectsValidated: { value: 1284, change: 31 },
  assetsTraded: { value: 89.2, unit: "M", change: 42 },
  monthlyTrend: [
    { month: "Sep", hectares: 1.2, carbon: 420, projects: 680 },
    { month: "Oct", hectares: 1.5, carbon: 520, projects: 790 },
    { month: "Nov", hectares: 1.7, carbon: 610, projects: 890 },
    { month: "Dec", hectares: 1.9, carbon: 690, projects: 980 },
    { month: "Jan", hectares: 2.1, carbon: 760, projects: 1100 },
    { month: "Feb", hectares: 2.4, carbon: 847, projects: 1284 },
  ],
};

export const operationalMetrics = {
  timeToValue: { value: 12, unit: "days", change: -18, target: 10 },
  deploymentVelocity: { value: 3.2, unit: "/week", change: 14 },
  completionRate: { value: 94, unit: "%", change: 3 },
};

export const strategicAlerts = [
  {
    type: "contract" as const,
    title: "Enterprise contract signed — Nordic Climate Fund",
    value: "$2.8M ARR",
    time: "2 hours ago",
  },
  {
    type: "partnership" as const,
    title: "Government partnership initiated — Kenya Ministry of Environment",
    value: "12 restoration sites",
    time: "6 hours ago",
  },
  {
    type: "ecosystem" as const,
    title: "Milestone: 2M hectares of verified restoration reached",
    value: "+340K this quarter",
    time: "1 day ago",
  },
  {
    type: "transaction" as const,
    title: "Large transaction executed — regenerative carbon credits",
    value: "$4.1M settled",
    time: "1 day ago",
  },
  {
    type: "contract" as const,
    title: "Agricultural cooperative onboarded — Brazilian Cerrado Alliance",
    value: "180K hectares",
    time: "2 days ago",
  },
  {
    type: "ecosystem" as const,
    title: "Carbon sequestration verification passed audit — Southeast Asia bloc",
    value: "142K tons verified",
    time: "3 days ago",
  },
];

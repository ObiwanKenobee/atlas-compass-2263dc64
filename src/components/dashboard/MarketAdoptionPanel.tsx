import { marketAdoption } from "@/lib/dashboard-data";

const MarketAdoptionPanel = () => {
  const maxSector = Math.max(...marketAdoption.sectors.map((s) => s.value));

  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-cyan" />
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Market Adoption Intelligence
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
        {/* Global Map Visualization */}
        <div className="rounded-lg border border-border bg-card p-5 lg:col-span-3">
          <div className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Global Presence
          </div>
          <div className="relative h-64 overflow-hidden rounded-md bg-secondary/50">
            {/* Simplified world map with dots */}
            <svg viewBox="0 0 800 400" className="h-full w-full opacity-80">
              {/* Continent outlines - simplified */}
              <ellipse cx="200" cy="160" rx="120" ry="80" fill="none" stroke="hsl(220, 15%, 22%)" strokeWidth="0.5" />
              <ellipse cx="420" cy="150" rx="100" ry="90" fill="none" stroke="hsl(220, 15%, 22%)" strokeWidth="0.5" />
              <ellipse cx="560" cy="180" rx="70" ry="60" fill="none" stroke="hsl(220, 15%, 22%)" strokeWidth="0.5" />
              <ellipse cx="650" cy="200" rx="50" ry="40" fill="none" stroke="hsl(220, 15%, 22%)" strokeWidth="0.5" />
              <ellipse cx="220" cy="280" rx="60" ry="70" fill="none" stroke="hsl(220, 15%, 22%)" strokeWidth="0.5" />
              <ellipse cx="700" cy="310" rx="50" ry="40" fill="none" stroke="hsl(220, 15%, 22%)" strokeWidth="0.5" />
              
              {/* Active regions with pulsing dots */}
              {marketAdoption.regions.map((region, i) => {
                const x = ((region.lng + 180) / 360) * 800;
                const y = ((90 - region.lat) / 180) * 400;
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r={region.intensity * 30} fill="hsl(192, 60%, 50%)" opacity={0.1} />
                    <circle cx={x} cy={y} r={region.intensity * 18} fill="hsl(192, 60%, 50%)" opacity={0.2} />
                    <circle cx={x} cy={y} r={4} fill="hsl(192, 60%, 50%)" opacity={0.9} />
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {marketAdoption.regions.slice(0, 4).map((region) => (
              <div key={region.name} className="rounded-md bg-secondary/50 px-3 py-2">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{region.name}</div>
                <div className="font-mono text-sm text-foreground">{region.partners} partners</div>
                <div className="font-mono text-xs text-muted-foreground">{region.projects} projects</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sector Adoption */}
        <div className="rounded-lg border border-border bg-card p-5 lg:col-span-2">
          <div className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Sector Adoption
          </div>
          <div className="flex flex-col gap-3">
            {marketAdoption.sectors.map((sector) => (
              <div key={sector.name}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs text-secondary-foreground">{sector.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">{sector.value}</span>
                </div>
                <div className="h-2 rounded-full bg-secondary">
                  <div
                    className={`h-full rounded-full transition-all ${
                      sector.color === "sage" ? "bg-sage/70" : "bg-cyan/70"
                    }`}
                    style={{ width: `${(sector.value / maxSector) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketAdoptionPanel;

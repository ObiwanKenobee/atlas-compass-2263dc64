import { useState } from "react";
import { marketAdoption } from "@/lib/dashboard-data";
import AnimatedSection from "./AnimatedSection";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin } from "lucide-react";

const MarketAdoptionPanel = () => {
  const maxSector = Math.max(...marketAdoption.sectors.map((s) => s.value));
  const [selectedRegion, setSelectedRegion] = useState<typeof marketAdoption.regions[0] | null>(null);

  return (
    <AnimatedSection delay={0.05}>
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
            <div className="relative h-48 sm:h-64 overflow-hidden rounded-md bg-secondary/50">
              <svg viewBox="0 0 800 400" className="h-full w-full opacity-80">
                <ellipse cx="200" cy="160" rx="120" ry="80" fill="none" stroke="hsl(220, 15%, 22%)" strokeWidth="0.5" />
                <ellipse cx="420" cy="150" rx="100" ry="90" fill="none" stroke="hsl(220, 15%, 22%)" strokeWidth="0.5" />
                <ellipse cx="560" cy="180" rx="70" ry="60" fill="none" stroke="hsl(220, 15%, 22%)" strokeWidth="0.5" />
                <ellipse cx="650" cy="200" rx="50" ry="40" fill="none" stroke="hsl(220, 15%, 22%)" strokeWidth="0.5" />
                <ellipse cx="220" cy="280" rx="60" ry="70" fill="none" stroke="hsl(220, 15%, 22%)" strokeWidth="0.5" />
                <ellipse cx="700" cy="310" rx="50" ry="40" fill="none" stroke="hsl(220, 15%, 22%)" strokeWidth="0.5" />

                {marketAdoption.regions.map((region, i) => {
                  const x = ((region.lng + 180) / 360) * 800;
                  const y = ((90 - region.lat) / 180) * 400;
                  const isSelected = selectedRegion?.name === region.name;
                  return (
                    <g
                      key={i}
                      className="cursor-pointer"
                      onClick={() => setSelectedRegion(isSelected ? null : region)}
                    >
                      <circle cx={x} cy={y} r={region.intensity * 30} fill="hsl(192, 60%, 50%)" opacity={isSelected ? 0.25 : 0.1} />
                      <circle cx={x} cy={y} r={region.intensity * 18} fill="hsl(192, 60%, 50%)" opacity={isSelected ? 0.4 : 0.2} />
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? 6 : 4}
                        fill={isSelected ? "hsl(152, 35%, 52%)" : "hsl(192, 60%, 50%)"}
                        opacity={0.9}
                        className="transition-all"
                      />
                      {isSelected && (
                        <circle cx={x} cy={y} r={10} fill="none" stroke="hsl(152, 35%, 52%)" strokeWidth="1" opacity={0.6} />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Region detail or region grid */}
            <AnimatePresence mode="wait">
              {selectedRegion ? (
                <motion.div
                  key="detail"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 rounded-md border border-sage/20 bg-sage/5 p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-sage" />
                      <span className="text-sm font-medium text-foreground">{selectedRegion.name}</span>
                    </div>
                    <button
                      onClick={() => setSelectedRegion(null)}
                      className="rounded p-1 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Partners</div>
                      <div className="font-mono text-lg text-foreground">{selectedRegion.partners}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Projects</div>
                      <div className="font-mono text-lg text-foreground">{selectedRegion.projects}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Intensity</div>
                      <div className="font-mono text-lg text-foreground">{Math.round(selectedRegion.intensity * 100)}%</div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4"
                >
                  {marketAdoption.regions.slice(0, 4).map((region) => (
                    <div
                      key={region.name}
                      className="cursor-pointer rounded-md bg-secondary/50 px-3 py-2 transition-colors hover:bg-secondary"
                      onClick={() => setSelectedRegion(region)}
                    >
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{region.name}</div>
                      <div className="font-mono text-sm text-foreground">{region.partners} partners</div>
                      <div className="font-mono text-xs text-muted-foreground">{region.projects} projects</div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
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
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(sector.value / maxSector) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className={`h-full rounded-full ${
                        sector.color === "sage" ? "bg-sage/70" : "bg-cyan/70"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
};

export default MarketAdoptionPanel;

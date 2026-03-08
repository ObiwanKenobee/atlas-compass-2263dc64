import { Activity, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import NotificationInbox from "./NotificationInbox";

const DashboardHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const now = new Date();
  const formatted = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8 lg:py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sage/10">
            <Activity className="h-4 w-4 text-sage" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-foreground">
              Atlas Sanctum
            </h1>
            <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              Executive Dashboard
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <div className="h-1.5 w-1.5 rounded-full bg-sage animate-pulse-soft" />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Live
            </span>
          </div>
          <span className="hidden text-xs text-muted-foreground sm:block">{formatted}</span>
          <ThemeToggle />
          <button
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border px-4 sm:hidden"
          >
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-sage animate-pulse-soft" />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Live</span>
              </div>
              <span className="text-xs text-muted-foreground">{formatted}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default DashboardHeader;

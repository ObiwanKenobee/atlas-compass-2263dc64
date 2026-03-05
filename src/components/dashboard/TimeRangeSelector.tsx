import { useState } from "react";

type TimeRange = "3M" | "6M" | "12M";

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

const TimeRangeSelector = ({ value, onChange }: TimeRangeSelectorProps) => {
  const ranges: TimeRange[] = ["3M", "6M", "12M"];

  return (
    <div className="flex items-center gap-1 rounded-md bg-secondary/50 p-0.5">
      {ranges.map((range) => (
        <button
          key={range}
          onClick={() => onChange(range)}
          className={`rounded-sm px-2.5 py-1 font-mono text-[10px] tracking-wider transition-all ${
            value === range
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {range}
        </button>
      ))}
    </div>
  );
};

export { TimeRangeSelector };
export type { TimeRange };

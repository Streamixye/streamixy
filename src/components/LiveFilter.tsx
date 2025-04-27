
import React from "react";
import { cn } from "@/lib/utils";

interface LiveFilterProps {
  name: string;
  isActive: boolean;
  onClick: () => void;
}

const LiveFilter: React.FC<LiveFilterProps> = ({ name, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "min-w-20 px-3 py-2 rounded-lg text-sm font-medium transition-all",
        isActive 
          ? "bg-streamixy-primary text-white" 
          : "bg-white/10 text-white/80 hover:bg-white/20"
      )}
    >
      {name}
    </button>
  );
};

export default LiveFilter;

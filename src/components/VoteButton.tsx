
import React from "react";
import { cn } from "@/lib/utils";

interface VoteButtonProps {
  icon: React.ReactNode;
  count: number;
  label: string;
  onClick?: () => void;
  active?: boolean;
}

const VoteButton: React.FC<VoteButtonProps> = ({
  icon,
  count,
  label,
  onClick,
  active = false,
}) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center glass p-3 rounded-full transition-all hover:bg-streamixy-primary/30"
    >
      <div
        className={cn(
          "text-white mb-1",
          active && "text-streamixy-highlight"
        )}
      >
        {icon}
      </div>
      <span className="text-xs font-semibold text-white">
        {count > 999 ? `${(count / 1000).toFixed(1)}K` : count}
      </span>
      <span className="text-[10px] text-white/70">{label}</span>
    </button>
  );
};

export default VoteButton;

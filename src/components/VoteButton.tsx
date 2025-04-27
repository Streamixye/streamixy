
import React from "react";
import { cn } from "@/lib/utils";

interface VoteButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
}

const VoteButton: React.FC<VoteButtonProps> = ({
  icon,
  label,
  onClick,
  active = false,
}) => {
  // Ensure the click doesn't bubble up AND doesn't trigger default behavior
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) onClick();
  };

  return (
    <button
      onClick={handleClick}
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
      <span className="text-[10px] text-white/70">{label}</span>
    </button>
  );
};

export default VoteButton;

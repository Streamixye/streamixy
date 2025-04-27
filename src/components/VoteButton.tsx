
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
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) onClick();
  };

  return (
    <button
      onClick={handleClick}
      className="flex flex-col items-center glass p-2 rounded-full mb-3 transition-all hover:bg-streamixy-primary/30"
    >
      <div
        className={cn(
          "text-white",
          active && "text-streamixy-highlight"
        )}
      >
        {icon}
      </div>
      <span className="text-[9px] text-white/70 mt-0.5">{label}</span>
    </button>
  );
};

export default VoteButton;

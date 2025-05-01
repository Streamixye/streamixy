
import React from "react";
import { cn } from "@/lib/utils";

interface VoteButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
  requiresWallet?: boolean;
  onWalletRequired?: () => void;
}

const VoteButton: React.FC<VoteButtonProps> = ({
  icon,
  label,
  onClick,
  active = false,
  requiresWallet = false,
  onWalletRequired,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If wallet is required but not connected, trigger wallet required callback
    if (requiresWallet) {
      const hasWallet = localStorage.getItem('userWalletConnected') === 'true';
      if (!hasWallet && onWalletRequired) {
        onWalletRequired();
        return;
      }
    }
    
    if (onClick) onClick();
  };

  return (
    <button
      onClick={handleClick}
      className="flex flex-col items-center glass p-1.5 rounded-full mb-2 transition-all hover:bg-streamixy-primary/30"
    >
      <div
        className={cn(
          "text-white",
          active && "text-streamixy-highlight"
        )}
      >
        {icon}
      </div>
      <span className="text-[8px] text-white/70 mt-0.5">{label}</span>
    </button>
  );
};

export default VoteButton;

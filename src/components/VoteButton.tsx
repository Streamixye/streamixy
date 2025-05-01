
import React from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If wallet is required but not connected, trigger wallet required callback
    if (requiresWallet) {
      const hasWallet = localStorage.getItem('userWalletConnected') === 'true';
      if (!hasWallet) {
        if (onWalletRequired) {
          onWalletRequired();
        } else {
          // Default wallet required behavior
          toast({
            title: "Wallet Connection Required",
            description: "Please connect your wallet from the dashboard to access this feature.",
            variant: "destructive",
          });
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        }
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

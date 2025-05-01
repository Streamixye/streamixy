
import React from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Configuration types for wallet integration
export interface WalletConfig {
  requiresWallet: boolean;
  redirectPath?: string;
  redirectDelay?: number;
}

// Define props interface with improved documentation
export interface VoteButtonProps {
  /** Icon to display in the button */
  icon: React.ReactNode;
  /** Label text for the button */
  label: string;
  /** Click handler function */
  onClick?: () => void;
  /** Whether the button is in active state */
  active?: boolean;
  /** Whether wallet connection is required */
  requiresWallet?: boolean;
  /** Optional custom wallet required callback */
  onWalletRequired?: () => void;
  /** Optional configuration for wallet interactions */
  walletConfig?: Partial<WalletConfig>;
}

/**
 * VoteButton Component
 * 
 * Used for interactive elements that may require wallet connectivity
 * such as voting, gifting, following, etc.
 */
const VoteButton: React.FC<VoteButtonProps> = ({
  icon,
  label,
  onClick,
  active = false,
  requiresWallet = false,
  onWalletRequired,
  walletConfig,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Default wallet configuration that can be overridden
  const defaultWalletConfig: WalletConfig = {
    requiresWallet: requiresWallet,
    redirectPath: '/dashboard',
    redirectDelay: 1500,
  };
  
  // Merge provided config with defaults
  const config = { ...defaultWalletConfig, ...walletConfig };
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Wallet connection check with configurable behavior
    if (config.requiresWallet) {
      const hasWallet = localStorage.getItem('userWalletConnected') === 'true';
      if (!hasWallet) {
        // Use custom callback if provided
        if (onWalletRequired) {
          onWalletRequired();
        } else {
          // Default wallet required behavior
          toast({
            title: "Wallet Connection Required",
            description: "Please connect your wallet from the dashboard to access this feature.",
            variant: "destructive",
          });
          
          // Configurable redirection
          if (config.redirectPath) {
            setTimeout(() => {
              navigate(config.redirectPath!);
            }, config.redirectDelay);
          }
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
      data-testid={`vote-button-${label.toLowerCase()}`}
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


import React, { useState } from "react";
import { Gift, Search, Share, Heart } from "lucide-react";
import VoteButton from "../VoteButton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import LiveComment from "../LiveComment";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Configuration for wallet requirements
const WALLET_CONFIG = {
  redirectPath: '/dashboard',
  redirectDelay: 2000
};

export interface ActionButtonsProps {
  /** Handler for vote button clicks */
  onVoteClick: () => void;
  /** Handler for gift button clicks */
  onGiftClick: () => void;
  /** Handler for share button clicks */
  onShareClick: () => void;
  /** Handler for search button clicks */
  onSearchClick: () => void;
  /** Handler for request button clicks */
  onRequestClick: () => void;
  /** Current request status */
  requestStatus: "idle" | "pending" | "accepted" | "rejected";
  /** Function to stop event propagation */
  stopAllPropagation: (e: React.MouseEvent) => void;
  /** Unique identifier for the reel */
  reelId: string;
}

/**
 * Action Buttons Component
 * 
 * Displays interactive buttons for video interactions like voting, gifts, etc.
 */
const ActionButtons: React.FC<ActionButtonsProps> = ({
  onVoteClick,
  onGiftClick,
  onShareClick,
  onSearchClick,
  onRequestClick,
  requestStatus,
  stopAllPropagation,
  reelId
}) => {
  const [commentCounter, setCommentCounter] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Custom wallet required handler with configurable behavior
  const handleWalletRequired = () => {
    toast({
      title: "Wallet Connection Required",
      description: "Please connect your wallet from the dashboard to perform this action.",
      variant: "destructive",
    });
    
    // Redirect to dashboard after a short delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div 
      className="absolute right-4 bottom-32 flex flex-col space-y-6"
      onClick={stopAllPropagation}
    >
      <div className="flex flex-col items-center space-y-6">
        <div onClick={(e) => e.stopPropagation()}>
          <VoteButton
            icon={<Heart className="h-7 w-7" />}
            label="Vote"
            onClick={onVoteClick}
            requiresWallet={true}
            onWalletRequired={handleWalletRequired}
            walletConfig={WALLET_CONFIG}
          />
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <VoteButton
            icon={<Gift className="h-7 w-7" />}
            label="Gift"
            onClick={onGiftClick}
            requiresWallet={true}
            onWalletRequired={handleWalletRequired}
            walletConfig={WALLET_CONFIG}
          />
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <VoteButton
            icon={<Share className="h-7 w-7" />}
            label="Share"
            onClick={onShareClick}
          />
        </div>

        <button 
          className="bg-black/40 backdrop-blur-sm p-3 rounded-full hover:bg-streamixy-primary/30 transition-all"
          onClick={onSearchClick}
          data-testid="search-button"
        >
          <Search className="h-7 w-7 text-white" />
          <span className="text-[8px] text-white/70 mt-0.5">Search</span>
        </button>
        
        <VoteButton
          icon={<Heart className="h-7 w-7" />}
          label="Request"
          onClick={onRequestClick}
          requiresWallet={true}
          onWalletRequired={handleWalletRequired}
          walletConfig={WALLET_CONFIG}
        />
      </div>
    </div>
  );
};

export default ActionButtons;

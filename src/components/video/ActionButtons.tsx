
import React, { useState, useEffect } from "react";
import { Gift, Search, Share, Heart } from "lucide-react";
import VoteButton from "../VoteButton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import LiveComment from "../LiveComment";

interface ActionButtonsProps {
  onVoteClick: () => void;
  onGiftClick: () => void;
  onShareClick: () => void;
  onSearchClick: () => void;
  onRequestClick: () => void;
  requestStatus: "idle" | "pending" | "accepted" | "rejected";
  stopAllPropagation: (e: React.MouseEvent) => void;
  reelId: string; // Add unique ID for each reel
}

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
          />
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <VoteButton
            icon={<Gift className="h-7 w-7" />}
            label="Gift"
            onClick={onGiftClick}
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
        >
          <Search className="h-7 w-7 text-white" />
          <span className="text-[8px] text-white/70 mt-0.5">Search</span>
        </button>
        
        <VoteButton
          icon={<Heart className="h-7 w-7" />}
          label="Request"
          onClick={onRequestClick}
        />
      </div>
    </div>
  );
};

export default ActionButtons;


import React, { useState } from "react";
import { Gift, Search, Share, Heart, MessageCircle } from "lucide-react";
import VoteButton from "../VoteButton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ActionButtonsProps {
  onVoteClick: () => void;
  onGiftClick: () => void;
  onShareClick: () => void;
  onSearchClick: () => void;
  onRequestClick: () => void;
  requestStatus: "idle" | "pending" | "accepted" | "rejected";
  stopAllPropagation: (e: React.MouseEvent) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onVoteClick,
  onGiftClick,
  onShareClick,
  onSearchClick,
  onRequestClick,
  requestStatus,
  stopAllPropagation
}) => {
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const { toast } = useToast();

  const handleCommentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCommentOpen(prev => !prev);
  };

  const handleSubmitComment = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!commentText.trim()) return;
    
    // In a real app, you would send this to your backend
    toast({
      title: "Comment Posted",
      description: "Your comment has been posted successfully.",
    });
    
    // Clear the input field and close the comment panel
    setCommentText("");
    setIsCommentOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      
      if (!commentText.trim()) return;
      
      toast({
        title: "Comment Posted",
        description: "Your comment has been posted successfully.",
      });
      
      setCommentText("");
      setIsCommentOpen(false);
    }
  };

  return (
    <div 
      className="absolute right-4 bottom-32 flex flex-col space-y-6"
      onClick={stopAllPropagation}
    >
      <div className="flex flex-col items-center space-y-6">
        {/* Comment Button - New button added above the Vote button */}
        <div onClick={(e) => e.stopPropagation()}>
          <VoteButton
            icon={<MessageCircle className="h-7 w-7" />}
            label="Comment"
            onClick={handleCommentClick}
          />
        </div>

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
          onClick={() => {
            if (requestStatus === "idle") {
              onRequestClick();
            }
          }}
        />
      </div>

      {/* Comment Form Popup */}
      {isCommentOpen && (
        <div 
          className="fixed bottom-24 right-16 z-50 bg-black/90 p-4 rounded-lg border border-white/10 w-72"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          data-prevent-scroll="true"
        >
          <h3 className="text-lg font-semibold mb-2">Add a comment</h3>
          <div className="flex flex-col space-y-2">
            <Textarea 
              placeholder="Share your thoughts..." 
              className="bg-transparent border-white/20 flex-1"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={handleKeyDown}
              data-prevent-scroll="true"
              autoFocus
            />
            <Button 
              onClick={handleSubmitComment}
              className="bg-purple-500 hover:bg-purple-600 h-10 w-full"
              disabled={!commentText.trim()}
              data-prevent-scroll="true"
            >
              Post Comment
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionButtons;

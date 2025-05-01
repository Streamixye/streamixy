
import React, { useState, useEffect } from "react";
import { Gift, Search, Share, Heart, MessageCircle } from "lucide-react";
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
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<{id: number, text: string}[]>([]);
  const [commentCounter, setCommentCounter] = useState(0);

  // Fix the comment click handler to work consistently
  const handleCommentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCommentOpen(prev => !prev);
  };

  const handleSubmitComment = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!commentText.trim()) return;
    
    // Add comment to the list
    const newComment = {
      id: commentCounter,
      text: commentText
    };
    
    setComments(prev => [...prev, newComment]);
    setCommentCounter(prev => prev + 1);
    
    // Clear the input field and close the comment panel
    setCommentText("");
    setIsCommentOpen(false);
    
    // Remove comment after animation duration
    setTimeout(() => {
      setComments(prev => prev.filter(comment => comment.id !== newComment.id));
    }, 3000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      
      if (!commentText.trim()) return;
      
      // Add comment to the list
      const newComment = {
        id: commentCounter,
        text: commentText
      };
      
      setComments(prev => [...prev, newComment]);
      setCommentCounter(prev => prev + 1);
      
      setCommentText("");
      setIsCommentOpen(false);
      
      // Remove comment after animation duration
      setTimeout(() => {
        setComments(prev => prev.filter(comment => comment.id !== newComment.id));
      }, 3000);
    }
  };

  // Force close comment box when reel changes
  useEffect(() => {
    setIsCommentOpen(false);
  }, [reelId]);

  return (
    <div 
      className="absolute right-4 bottom-32 flex flex-col space-y-6"
      onClick={stopAllPropagation}
    >
      <div className="flex flex-col items-center space-y-6">
        {/* Comment Button - Fixed to work consistently across all reels */}
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
          onClick={onRequestClick}
        />
      </div>

      {/* Floating Comments Display */}
      <div className="fixed left-4 bottom-32 flex flex-col space-y-2 z-30 pointer-events-none">
        {comments.map(comment => (
          <LiveComment 
            key={comment.id}
            username="You"
            text={comment.text}
            position={Math.random() > 0.5 ? "left" : "right"}
          />
        ))}
      </div>

      {/* Comment Form Popup - Using portals for proper rendering */}
      {isCommentOpen && (
        <div 
          className="fixed bottom-24 right-16 z-50 bg-black/90 p-4 rounded-lg border border-white/10 w-72"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          data-prevent-scroll="true"
          id={`comment-form-${reelId}`}
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

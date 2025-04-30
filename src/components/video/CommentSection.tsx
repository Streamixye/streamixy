
import React, { useState, useEffect } from "react";
import LiveComment from "../LiveComment";
import { MessageCircle, Heart, UserPlus, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CommentSectionProps {
  comments: {text: string, id: number, username: string}[];
  activeComment: {text: string, id: number, username: string} | null;
  onLike?: () => void;
  onFollow?: (followed: boolean) => void;
  onComment?: (text: string) => void;
  creatorName?: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ 
  comments, 
  onLike, 
  onFollow,
  onComment,
  creatorName = "Creator" 
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isCommentBoxOpen, setIsCommentBoxOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentsToShow, setCommentsToShow] = useState<{text: string, id: number, username: string}[]>([]);
  
  useEffect(() => {
    // Update comments to display
    setCommentsToShow(comments);
  }, [comments]);
  
  // Handle like button click
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onLike) onLike();
    // No toast notification as requested
  };
  
  // Handle follow button click
  const handleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFollowing(!isFollowing);
    
    if (onFollow) onFollow(!isFollowing);
  };

  // Handle comment box toggle
  const handleCommentToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCommentBoxOpen(!isCommentBoxOpen);
  };

  // Handle comment submission
  const handleCommentSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (commentText.trim() && onComment) {
      onComment(commentText);
      setCommentText("");
      // Close the comment box after sending
      setIsCommentBoxOpen(false);
      // No toast notification as requested
    }
  };

  // Handle Enter key in comment box for submission
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      
      if (commentText.trim() && onComment) {
        onComment(commentText);
        setCommentText("");
        // Close the comment box after sending
        setIsCommentBoxOpen(false);
        // No toast notification as requested
      }
    }
  };

  return (
    <>
      {/* Icons at the left side in a vertical list */}
      <div 
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex flex-col space-y-4"
        onClick={e => e.stopPropagation()}
        data-prevent-scroll="true"
      >
        {/* Follow icon - at top */}
        <div 
          className={`${isFollowing ? 'bg-streamixy-primary/80' : 'bg-black/50'} backdrop-blur-md rounded-full p-2 border border-white/10 cursor-pointer hover:bg-streamixy-primary/50 transition-colors`}
          onClick={handleFollow}
          data-prevent-scroll="true"
        >
          {isFollowing ? (
            <Check className="h-6 w-6 text-white" />
          ) : (
            <UserPlus className="h-6 w-6 text-white" />
          )}
        </div>
        
        {/* Love icon - in middle */}
        <div 
          className="bg-black/50 backdrop-blur-md rounded-full p-2 border border-white/10 cursor-pointer hover:bg-pink-500/30 transition-colors"
          onClick={handleLike}
          data-prevent-scroll="true"
        >
          <Heart className="h-6 w-6 text-white hover:fill-pink-500 transition-colors" />
        </div>
        
        {/* Comment icon - at bottom */}
        <div 
          className="bg-black/50 backdrop-blur-md rounded-full p-2 border border-white/10 cursor-pointer hover:bg-streamixy-primary/30 transition-colors"
          onClick={handleCommentToggle}
          data-prevent-scroll="true"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </div>
      </div>
      
      {/* Comments display */}
      <div className="absolute left-4 right-4 top-16 bottom-32 overflow-hidden pointer-events-none">
        {commentsToShow.map((comment) => (
          <LiveComment 
            key={comment.id} 
            username={comment.username} 
            text={comment.text} 
            position={comment.username === "You" ? "right" : "left"}
          />
        ))}
      </div>

      {/* TikTok/Instagram style comment box popup */}
      {isCommentBoxOpen && (
        <div 
          className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-white/10 p-4 z-50 animate-slide-in-bottom"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          data-prevent-scroll="true"
        >
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Comments</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/10"
                onClick={() => setIsCommentBoxOpen(false)}
                data-prevent-scroll="true"
              >
                Close
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a comment..."
                className="bg-black/50 border-white/20 text-white resize-none flex-1 h-10 min-h-0 py-2"
                onClick={(e) => e.stopPropagation()}
                data-prevent-scroll="true"
                autoFocus
              />
              <Button 
                onClick={handleCommentSubmit}
                className="bg-streamixy-primary hover:bg-streamixy-primary/80 h-10"
                disabled={!commentText.trim()}
                data-prevent-scroll="true"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
        @keyframes slide-in-bottom {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-in-bottom {
          animation: slide-in-bottom 0.3s ease-out forwards;
        }
        `}
      </style>
    </>
  );
};

export default CommentSection;

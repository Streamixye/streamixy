
import React, { useState } from "react";
import { Heart, UserPlus, Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import LiveComment from "../LiveComment";

interface CommentSectionProps {
  onLike?: () => void;
  onFollow?: (followed: boolean) => void;
  creatorName?: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ 
  onLike, 
  onFollow,
  creatorName = "Creator" 
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<{id: number, text: string}[]>([]);
  const [commentCounter, setCommentCounter] = useState(0);
  
  // Handle like button click
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onLike) onLike();
  };
  
  // Handle follow button click
  const handleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFollowing(!isFollowing);
    
    if (onFollow) onFollow(!isFollowing);
  };

  // Handle comment button click
  const handleCommentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCommentOpen(prev => !prev);
  };

  // Handle comment submission
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
    
    setCommentText("");
    setIsCommentOpen(false);
    
    // Remove comment after animation duration
    setTimeout(() => {
      setComments(prev => prev.filter(comment => comment.id !== newComment.id));
    }, 3000);
  };

  // Handle Enter key for submitting comments
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

  return (
    <>
      {/* Icons at the left side in a vertical list */}
      <div 
        className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col space-y-4"
        onClick={e => e.stopPropagation()}
        data-prevent-scroll="true"
      >
        {/* Comment icon - at top */}
        <div 
          className="bg-black/50 backdrop-blur-md rounded-full p-2 border border-white/10 cursor-pointer hover:bg-purple-500/30 transition-colors"
          onClick={handleCommentClick}
          data-prevent-scroll="true"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </div>
        
        {/* Follow icon - in middle */}
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
        
        {/* Love icon - at bottom */}
        <div 
          className="bg-black/50 backdrop-blur-md rounded-full p-2 border border-white/10 cursor-pointer hover:bg-pink-500/30 transition-colors"
          onClick={handleLike}
          data-prevent-scroll="true"
        >
          <Heart className="h-6 w-6 text-white hover:fill-pink-500 transition-colors" />
        </div>
      </div>

      {/* Floating Comments Display */}
      <div className="fixed left-4 bottom-32 flex flex-col space-y-2 z-30 pointer-events-none">
        {comments.map(comment => (
          <LiveComment 
            key={comment.id}
            username="You"
            text={comment.text}
            position="left"
          />
        ))}
      </div>

      {/* Comment Form Popup */}
      {isCommentOpen && (
        <div 
          className="fixed bottom-24 left-16 z-50 bg-black/90 p-4 rounded-lg border border-white/10 w-72"
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
    </>
  );
};

export default CommentSection;

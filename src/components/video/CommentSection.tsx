
import React, { useState } from "react";
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
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isCommentBoxOpen, setIsCommentBoxOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  
  // Handle like button click
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onLike) onLike();
    // Like notification removed as requested
  };
  
  // Handle follow button click
  const handleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFollowing(!isFollowing);
    
    if (onFollow) onFollow(!isFollowing);
    
    toast({
      title: isFollowing ? "Unfollowed" : "Following!",
      description: isFollowing 
        ? `You unfollowed ${creatorName}` 
        : `You are now following ${creatorName}`,
    });
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
      setIsCommentBoxOpen(false);
    }
  };
  
  return (
    <>
      {/* Icons at the left side in a vertical list */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex flex-col space-y-4" onClick={e => e.stopPropagation()}>
        {/* Follow icon - at top */}
        <div 
          className={`${isFollowing ? 'bg-streamixy-primary/80' : 'bg-black/50'} backdrop-blur-md rounded-full p-2 border border-white/10 cursor-pointer hover:bg-streamixy-primary/50 transition-colors`}
          onClick={handleFollow}
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
        >
          <Heart className="h-6 w-6 text-white hover:fill-pink-500 transition-colors" />
        </div>
        
        {/* Comment icon - at bottom */}
        <div 
          className="bg-black/50 backdrop-blur-md rounded-full p-2 border border-white/10 cursor-pointer hover:bg-streamixy-primary/30 transition-colors"
          onClick={handleCommentToggle}
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </div>
      </div>
      
      {/* Comments display */}
      <div className="absolute left-4 right-4 top-16 bottom-32 overflow-hidden pointer-events-none">
        {comments.map((comment) => (
          <LiveComment 
            key={comment.id} 
            username={comment.username} 
            text={comment.text} 
            position={comment.username === "You" ? "right" : "left"}
          />
        ))}
      </div>

      {/* Comment box popup */}
      {isCommentBoxOpen && (
        <div 
          className="absolute bottom-32 left-4 right-4 bg-black/80 backdrop-blur-sm p-4 rounded-lg border border-white/10 z-20"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div className="flex flex-col space-y-3">
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="bg-transparent border-white/20 text-white resize-none"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
              }}
            />
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsCommentBoxOpen(false);
                }}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleCommentSubmit}
                className="bg-streamixy-primary hover:bg-streamixy-primary/80"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CommentSection;

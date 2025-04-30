
import React, { useState } from "react";
import { Heart, UserPlus, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  return (
    <>
      {/* Icons at the left side in a vertical list */}
      <div 
        className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col space-y-4"
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
      </div>
    </>
  );
};

export default CommentSection;

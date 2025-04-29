
import React from "react";
import LiveComment from "../LiveComment";
import { MessageCircle, Heart, UserPlus } from "lucide-react";

interface CommentSectionProps {
  comments: {text: string, id: number, username: string}[];
  activeComment: {text: string, id: number, username: string} | null;
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments }) => {
  return (
    <>
      {/* Icons at the left side in a vertical list */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex flex-col space-y-4">
        {/* Follow icon - at top */}
        <div className="bg-black/50 backdrop-blur-md rounded-full p-2 border border-white/10">
          <UserPlus className="h-6 w-6 text-white" />
        </div>
        
        {/* Love icon - in middle */}
        <div className="bg-black/50 backdrop-blur-md rounded-full p-2 border border-white/10">
          <Heart className="h-6 w-6 text-white" />
        </div>
        
        {/* Comment icon - at bottom */}
        <div className="bg-black/50 backdrop-blur-md rounded-full p-2 border border-white/10">
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
    </>
  );
};

export default CommentSection;

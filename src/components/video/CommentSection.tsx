
import React from "react";
import LiveComment from "../LiveComment";

interface CommentSectionProps {
  comments: {text: string, id: number, username: string}[];
  activeComment: {text: string, id: number, username: string} | null;
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments }) => {
  return (
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
  );
};

export default CommentSection;

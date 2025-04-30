
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface LiveCommentProps {
  username: string;
  text: string;
  avatarUrl?: string;
  position?: "left" | "right";
}

const LiveComment: React.FC<LiveCommentProps> = ({ 
  username, 
  text, 
  avatarUrl,
  position = "left"
}) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Make the comment visible immediately after mounting
    const showTimeout = setTimeout(() => {
      setVisible(true);
    }, 10);
    
    // After exactly 1 second, start fading out
    const hideTimeout = setTimeout(() => {
      setVisible(false);
    }, 1000);
    
    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, []);
  
  return (
    <div 
      className={cn(
        "flex items-center bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 mb-2 max-w-[80%] transition-opacity duration-300",
        position === "left" ? "ml-4" : "mr-4 self-end",
        visible ? "opacity-100" : "opacity-0",
        "animate-fade-in"
      )}
      style={{
        alignSelf: position === "right" ? "flex-end" : "flex-start"
      }}
    >
      <Avatar className="h-6 w-6 mr-2">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback className="text-xs">{username[0]}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-xs font-bold text-white">{username}</span>
        <span className="text-sm text-white">{text}</span>
      </div>
    </div>
  );
};

export default LiveComment;

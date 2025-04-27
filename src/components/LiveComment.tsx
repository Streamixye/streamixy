
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface LiveCommentProps {
  username: string;
  text: string;
  avatarUrl?: string;
}

const LiveComment: React.FC<LiveCommentProps> = ({ username, text, avatarUrl }) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    setVisible(true);
    
    // After 4.5 seconds, start fading out
    const timeout = setTimeout(() => {
      setVisible(false);
    }, 4500);
    
    return () => clearTimeout(timeout);
  }, []);
  
  return (
    <div 
      className={cn(
        "flex items-center bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 mb-2 ml-4 max-w-[80%] transition-opacity duration-500",
        visible ? "opacity-100" : "opacity-0"
      )}
    >
      <Avatar className="h-6 w-6 mr-2">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback className="text-xs">{username[0]}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-xs font-bold">{username}</span>
        <span className="text-sm">{text}</span>
      </div>
    </div>
  );
};

export default LiveComment;

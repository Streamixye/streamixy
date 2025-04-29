
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface CreatorDisplayProps {
  creatorName: string;
  creatorAvatar: string;
  creatorTokens: number;
}

const CreatorDisplay: React.FC<CreatorDisplayProps> = ({ 
  creatorName,
  creatorAvatar,
  creatorTokens
}) => {
  return (
    <div className="absolute bottom-24 left-4 animate-slide-up">
      <div className="flex items-center bg-black/50 backdrop-blur-md rounded-lg py-1.5 px-3 border border-white/10">
        <span className="text-white text-sm font-medium mr-2">{creatorName}</span>
        <Avatar className="h-8 w-8 border-2 border-streamixy-primary">
          <AvatarImage src={creatorAvatar} alt={creatorName} />
          <AvatarFallback>{creatorName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="ml-2">
          <div className="flex items-center">
            <span className="text-streamixy-primary text-xs font-bold">SYX:</span>
            <span className="ml-1 text-white text-xs">{creatorTokens}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorDisplay;

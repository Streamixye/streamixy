
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CreatorInfoProps {
  creator: {
    name: string;
    username: string;
    avatar: string;
    followers: number;
  };
  className?: string;
}

const CreatorInfo: React.FC<CreatorInfoProps> = ({ creator, className }) => {
  return (
    <div className={cn("flex items-center space-x-3", className)}>
      <div className="relative">
        <img
          src={creator.avatar}
          alt={creator.name}
          className="h-12 w-12 rounded-full border-2 border-streamixy-primary"
        />
        <div className="absolute -bottom-1 -right-1 bg-streamixy-primary text-xs text-white rounded-full px-1">
          SYX
        </div>
      </div>
      <div className="flex flex-col">
        <h4 className="font-bold text-white">{creator.name}</h4>
        <p className="text-xs text-gray-300">@{creator.username}</p>
        <p className="text-xs text-gray-400">
          {creator.followers.toLocaleString()} followers
        </p>
      </div>
      <Button
        size="sm"
        className="ml-2 bg-streamixy-primary hover:bg-streamixy-primary/80"
      >
        Follow
      </Button>
    </div>
  );
};

export default CreatorInfo;


import React from "react";
import { Play, ThumbsUp, ThumbsDown, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import VoteButton from "./VoteButton";
import CreatorInfo from "./CreatorInfo";

interface VideoReelProps {
  streamId: string;
  title: string;
  creator: {
    name: string;
    username: string;
    avatar: string;
    followers: number;
  };
  viewers: number;
  likes: number;
  dislikes: number;
  isLive: boolean;
  thumbnailUrl: string;
}

const VideoReel: React.FC<VideoReelProps> = ({
  streamId,
  title,
  creator,
  viewers,
  likes,
  dislikes,
  isLive,
  thumbnailUrl,
}) => {
  return (
    <div className="relative w-full h-full flex">
      <div className="video-container w-full h-full bg-gradient-to-br from-streamixy-dark to-streamixy-primary/10">
        {/* Video Placeholder or Thumbnail */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${thumbnailUrl})` }}
        />
        
        {/* Overlay for dim effect */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Video Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-16 w-16 rounded-full bg-streamixy-primary/50 hover:bg-streamixy-primary/80 transition-all duration-300"
          >
            <Play className="h-8 w-8 text-white" />
          </Button>
        </div>

        {/* Live Indicator */}
        {isLive && (
          <div className="absolute top-4 left-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center animate-pulse-glow">
            <span className="mr-1 h-2 w-2 bg-white rounded-full"></span>
            LIVE
          </div>
        )}

        {/* Creator Info */}
        <div className="absolute bottom-20 left-4 animate-slide-up">
          <CreatorInfo creator={creator} />
        </div>

        {/* Stream Title */}
        <div className="absolute bottom-40 left-4 max-w-[80%]">
          <h3 className="text-lg font-bold text-white glow-text">{title}</h3>
        </div>

        {/* Viewer Count */}
        <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full flex items-center space-x-1">
          <Users className="h-4 w-4 text-white" />
          <span className="text-xs text-white">{viewers}</span>
        </div>

        {/* Voting Section */}
        <div className="absolute right-4 bottom-1/3 flex flex-col space-y-4">
          <VoteButton
            icon={<ThumbsUp className="h-6 w-6" />}
            count={likes}
            label="Up"
          />
          <VoteButton
            icon={<ThumbsDown className="h-6 w-6" />}
            count={dislikes}
            label="Down"
          />
        </div>

        {/* SYX Token Vote Section */}
        <div className="absolute bottom-20 right-4 glass p-2 rounded-lg animate-fade-in">
          <div className="flex flex-col items-center space-y-2">
            <span className="text-xs text-streamixy-light/80">Vote SYX</span>
            <div className="flex space-x-2">
              <Button className="bg-streamixy-highlight hover:bg-streamixy-highlight/80 p-1 h-auto w-10 text-xs rounded-md">
                +10
              </Button>
              <Button className="bg-streamixy-highlight hover:bg-streamixy-highlight/80 p-1 h-auto w-10 text-xs rounded-md">
                +50
              </Button>
            </div>
            <Button className="bg-streamixy-highlight hover:bg-streamixy-highlight/80 p-1 h-auto w-20 text-xs rounded-md">
              +100
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoReel;

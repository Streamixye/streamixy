
import React from "react";

interface VideoSourceProps {
  reelId: string;
}

export const VideoSource: React.FC<VideoSourceProps> = ({ reelId }) => {
  // Map of sample videos for different reels - using only videos known to work well with autoplay
  const videoSources: Record<string, string> = {
    "stream-1": "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "stream-2": "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "stream-3": "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "stream-4": "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "stream-5": "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "default": "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
  };

  // Get video source based on reelId, fall back to default if not found
  const videoSource = videoSources[reelId] || videoSources["default"];
  
  return <source src={videoSource} type="video/mp4" />;
};

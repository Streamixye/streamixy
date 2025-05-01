
import React, { useRef, useEffect } from "react";
import { Heart } from "lucide-react";

interface VideoContainerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  thumbnailUrl: string;
  handleDoubleClick: (e: React.MouseEvent) => void;
  handleTap: (e: React.TouchEvent) => void;
  isLive: boolean;
  likeAnimations: {id: number, x: number, y: number}[];
  displayedViewers: number;
  reelId: string; // Add reelId prop to pick different videos
}

const VideoContainer: React.FC<VideoContainerProps> = ({
  videoRef,
  thumbnailUrl,
  handleDoubleClick,
  handleTap,
  isLive,
  likeAnimations,
  displayedViewers,
  reelId
}) => {
  // Map of sample videos for different reels
  const videoSources: Record<string, string> = {
    "stream-1": "https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4",
    "stream-2": "https://assets.mixkit.co/videos/preview/mixkit-woman-running-under-a-bridge-32999-large.mp4",
    "stream-3": "https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-changing-lights-1240-large.mp4",
    "stream-4": "https://assets.mixkit.co/videos/preview/mixkit-cooking-with-a-wok-on-a-gas-burner-2340-large.mp4",
    "stream-5": "https://assets.mixkit.co/videos/preview/mixkit-woman-doing-a-yoga-position-at-sunset-1236-large.mp4",
    // Default source in case reelId doesn't match
    "default": "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4"
  };

  // Get video source based on reelId, fall back to default if not found
  const videoSource = videoSources[reelId] || videoSources["default"];

  return (
    <>
      <video
        ref={videoRef}
        className="absolute inset-0 object-cover w-full h-full"
        onDoubleClick={handleDoubleClick}
        onTouchStart={handleTap}
        muted={false} // Enable audio
        loop
        playsInline
        poster={thumbnailUrl}
        preload="auto"
      >
        <source src={videoSource} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {/* Like animations */}
      {likeAnimations.map(like => (
        <div 
          key={like.id}
          className="absolute animate-like-float pointer-events-none"
          style={{ 
            left: `${like.x}%`,
            top: `${like.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Heart className="text-pink-500 h-12 w-12 fill-pink-500" />
        </div>
      ))}

      {isLive && (
        <div className="absolute top-4 left-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1 animate-pulse pointer-events-none">
          <span className="h-2 w-2 bg-white rounded-full"></span>
          <span>LIVE</span>
        </div>
      )}

      <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full flex items-center space-x-1 pointer-events-none">
        <span className="text-xs text-white animate-pulse">{displayedViewers} viewers</span>
      </div>

      {/* Add volume control button */}
      <div className="absolute bottom-4 right-4 z-10">
        <button 
          className="bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-streamixy-primary/30 transition-all"
          onClick={(e) => {
            e.stopPropagation();
            if (videoRef.current) {
              videoRef.current.muted = !videoRef.current.muted;
            }
          }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-white"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        </button>
      </div>
    </>
  );
};

export default VideoContainer;

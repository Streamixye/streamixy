
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
}

const VideoContainer: React.FC<VideoContainerProps> = ({
  videoRef,
  thumbnailUrl,
  handleDoubleClick,
  handleTap,
  isLive,
  likeAnimations,
  displayedViewers
}) => {
  return (
    <>
      <video
        ref={videoRef}
        className="absolute inset-0 object-cover w-full h-full"
        onDoubleClick={handleDoubleClick}
        onTouchStart={handleTap}
        muted
        loop
        playsInline
        poster={thumbnailUrl}
        preload="auto"
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4" type="video/mp4" />
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
        <div className="fixed top-4 left-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1 animate-pulse pointer-events-none z-30">
          <span className="h-2 w-2 bg-white rounded-full"></span>
          <span>LIVE</span>
        </div>
      )}

      <div className="fixed top-4 right-4 glass px-3 py-1 rounded-full flex items-center space-x-1 pointer-events-none z-30">
        <span className="text-xs text-white animate-pulse">{displayedViewers} viewers</span>
      </div>
    </>
  );
};

export default VideoContainer;


import React, { useRef, useEffect } from "react";
import { VideoSource } from "./VideoSource";
import { LikeAnimations } from "./LikeAnimations";
import { VideoOverlays } from "./VideoOverlays";
import { useVideoPlayback } from "@/hooks/use-video-playback";

interface VideoContainerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  thumbnailUrl: string;
  handleDoubleClick: (e: React.MouseEvent) => void;
  handleTap: (e: React.TouchEvent) => void;
  isLive: boolean;
  likeAnimations: {id: number, x: number, y: number}[];
  displayedViewers: number;
  reelId: string;
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
  // Use our custom hook for video playback management
  const { isMuted, toggleMute } = useVideoPlayback({
    videoRef, 
    reelId
  });

  // Add event listeners for user interaction to help with autoplay
  useEffect(() => {
    const handleUserInteraction = () => {
      if (videoRef.current && videoRef.current.paused) {
        videoRef.current.play().catch(err => console.error("Failed to play on user interaction:", err));
      }
    };
    
    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);
    
    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [videoRef]);

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
        autoPlay
        poster={thumbnailUrl}
        preload="auto"
        data-reel-id={reelId}
      >
        <VideoSource reelId={reelId} />
        Your browser does not support the video tag.
      </video>
      
      {/* Video overlays including mute button */}
      <VideoOverlays 
        isLive={isLive} 
        displayedViewers={displayedViewers} 
        isMuted={isMuted}
        toggleMute={toggleMute}
      />

      {/* Like animations */}
      <LikeAnimations animations={likeAnimations} />
    </>
  );
};

export default VideoContainer;

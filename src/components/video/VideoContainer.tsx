
import React, { useRef, useEffect } from "react";
import { VideoSource } from "./VideoSource";
import { LikeAnimations } from "./LikeAnimations";
import { VideoOverlays } from "./VideoOverlays";
import { useVideoPlayback } from "@/hooks/use-video-playback";
import "./VideoContainer.css";

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
  // Use our custom hook for video playback management with autoUnmute set to true
  const { isMuted, toggleMute } = useVideoPlayback({
    videoRef, 
    reelId,
    autoUnmute: true // Enable auto unmuting for audio
  });

  // Add event listeners for user interaction to help with autoplay
  useEffect(() => {
    const handleUserInteraction = () => {
      if (videoRef.current && videoRef.current.paused) {
        // Try to play with audio
        videoRef.current.muted = false;
        videoRef.current.play().catch(err => {
          console.error("Failed to play with audio on user interaction:", err);
          // Fall back to muted if needed
          videoRef.current!.muted = true;
          videoRef.current!.play().catch(err => {
            console.error("Failed to play even muted on user interaction:", err);
          });
        });
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


import React, { useRef, useEffect, useState } from "react";
import { Heart } from "lucide-react";

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
  const [isMuted, setIsMuted] = useState(true);
  
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
  
  // Force play the video when it's in view
  useEffect(() => {
    if (!videoRef.current) return;
    
    // Function to attempt playback with more aggressive retry
    const attemptPlayback = () => {
      if (!videoRef.current) return;
      
      // Always start muted to increase chance of autoplay success
      videoRef.current.muted = true;
      setIsMuted(true);
      
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Video autoplay started for", reelId);
          })
          .catch(error => {
            console.error("Autoplay prevented:", error);
            // More aggressive retry with reduced intervals
            setTimeout(attemptPlayback, 500);
          });
      }
    };
    
    // Create intersection observer to play/pause when in/out of view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && videoRef.current) {
            // Attempt to play the video that's in view
            attemptPlayback();
            
            // Pause all other videos
            document.querySelectorAll('video').forEach(video => {
              if (video !== videoRef.current) {
                video.pause();
                video.muted = true;
              }
            });
          } else if (!entry.isIntersecting && videoRef.current) {
            // Pause when out of view to save resources
            videoRef.current.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
      
      // Start attempting playback immediately
      attemptPlayback();
    }

    // Add event listeners for user interaction to help with autoplay
    const handleUserInteraction = () => {
      if (videoRef.current && videoRef.current.paused) {
        attemptPlayback();
      }
    };
    
    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);
    
    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
        videoRef.current.pause();
      }
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [reelId]);

  // Toggle mute status with proper isolation
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const newMutedState = !videoRef.current.muted;
      
      // First mute all videos
      document.querySelectorAll('video').forEach(video => {
        video.muted = true;
      });
      
      // Then unmute only the current video if requested
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

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

      {/* Volume control button - always visible */}
      <div className="absolute bottom-4 right-4 z-10">
        <button 
          className="bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-streamixy-primary/30 transition-all"
          onClick={toggleMute}
        >
          {!isMuted ? (
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
          ) : (
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
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </button>
      </div>
    </>
  );
};

export default VideoContainer;

import React, { useRef, useEffect, useState } from "react";
import { Heart, Volume2, VolumeX } from "lucide-react";

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
      
      // Start muted to increase chance of autoplay success, but keep track of original muted state
      const wasMuted = videoRef.current.muted;
      videoRef.current.muted = true;
      
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Video autoplay started for", reelId);
            
            // Now that playback has started, we can restore the original muted state
            // But only if this is the currently visible video (in the viewport)
            if (!wasMuted && isVideoInViewport(videoRef.current!)) {
              setTimeout(() => {
                if (videoRef.current) {
                  videoRef.current.muted = false;
                  setIsMuted(false);
                }
              }, 300);
            }
          })
          .catch(error => {
            console.error("Autoplay prevented:", error);
            // More aggressive retry with reduced intervals
            setTimeout(attemptPlayback, 500);
          });
      }
    };
    
    // Helper function to check if an element is in the viewport
    const isVideoInViewport = (video: HTMLVideoElement) => {
      const rect = video.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    };
    
    // Create intersection observer to play/pause when in/out of view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && videoRef.current) {
            // Before playing this video, pause and mute all others
            document.querySelectorAll('video').forEach(video => {
              if (video !== videoRef.current) {
                video.pause();
                video.muted = true;
              }
            });
            
            // Attempt to play the video that's in view
            attemptPlayback();
            
          } else if (!entry.isIntersecting && videoRef.current) {
            // Pause and always mute when out of view
            videoRef.current.pause();
            videoRef.current.muted = true;
            setIsMuted(true);
          }
        });
      },
      { threshold: 0.6 } // Increased threshold for better audio control
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
      
      // Start attempting playback immediately
      attemptPlayback();
    }

    // Add event listeners for user interaction to help with autoplay and unmuting
    const handleUserInteraction = () => {
      if (videoRef.current && videoRef.current.paused) {
        attemptPlayback();
      }
    };
    
    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);
    
    // Custom event listener for when a reel becomes active
    const handleReelActive = (e: CustomEvent) => {
      const targetReelId = e.detail.reelId;
      if (targetReelId === reelId && videoRef.current) {
        // This is the active reel, ensure it plays with possible unmuting
        const shouldUnmute = !isMuted;
        attemptPlayback();
        
        // Attempt to unmute if it was previously unmuted
        if (shouldUnmute) {
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.muted = false;
              setIsMuted(false);
            }
          }, 300);
        }
      } else if (videoRef.current) {
        // This is not the active reel, ensure it's paused and muted
        videoRef.current.pause();
        videoRef.current.muted = true;
        setIsMuted(true);
      }
    };
    
    // Add custom event listener
    document.addEventListener('reelActive', handleReelActive as EventListener);
    
    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
        videoRef.current.pause();
      }
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('reelActive', handleReelActive as EventListener);
    };
  }, [reelId, isMuted]);

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
      
      // If unmuting, ensure this video is playing
      if (!newMutedState && videoRef.current.paused) {
        videoRef.current.play().catch(err => console.error("Failed to play on unmute:", err));
      }
      
      // Dispatch a custom event to notify that this reel is now active
      const event = new CustomEvent('reelActive', { 
        detail: { reelId } 
      });
      document.dispatchEvent(event);
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

      {/* Volume control button - always visible with improved icons */}
      <div className="absolute bottom-6 right-6 z-10">
        <button 
          className="bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-streamixy-primary/30 transition-all"
          onClick={toggleMute}
        >
          {!isMuted ? (
            <Volume2 className="text-white h-6 w-6" />
          ) : (
            <VolumeX className="text-white h-6 w-6" />
          )}
        </button>
      </div>
    </>
  );
};

export default VideoContainer;

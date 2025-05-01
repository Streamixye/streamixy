
import { useEffect, RefObject, useState } from "react";

interface UseVideoPlaybackProps {
  videoRef: RefObject<HTMLVideoElement>;
  reelId: string;
  onPlaybackStatusChange?: (isPlaying: boolean) => void;
}

export function useVideoPlayback({ 
  videoRef, 
  reelId,
  onPlaybackStatusChange
}: UseVideoPlaybackProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  // Function to attempt playback with more aggressive retry
  const attemptPlayback = () => {
    if (!videoRef.current) return;
    
    // Start muted to increase chance of autoplay success
    videoRef.current.muted = true;
    
    const playPromise = videoRef.current.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log("Video autoplay started for", reelId);
          setIsPlaying(true);
          if (onPlaybackStatusChange) onPlaybackStatusChange(true);
        })
        .catch(error => {
          console.error("Autoplay prevented:", error);
          setIsPlaying(false);
          if (onPlaybackStatusChange) onPlaybackStatusChange(false);
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

  // Toggle mute status
  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (videoRef.current) {
      const newMutedState = !videoRef.current.muted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
      
      // Dispatch a custom event to notify that this reel is now active
      const event = new CustomEvent('reelActive', { 
        detail: { reelId } 
      });
      document.dispatchEvent(event);
    }
  };

  // Set up intersection observer for playing/pausing based on viewport visibility
  useEffect(() => {
    if (!videoRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && videoRef.current) {
            // This video is now in view, attempt to play
            attemptPlayback();
          } else if (!entry.isIntersecting && videoRef.current) {
            // Pause and mute when out of view
            videoRef.current.pause();
            videoRef.current.muted = true;
            setIsMuted(true);
            setIsPlaying(false);
            if (onPlaybackStatusChange) onPlaybackStatusChange(false);
          }
        });
      },
      { threshold: 0.6 }
    );

    observer.observe(videoRef.current);
    
    // Start attempting playback immediately
    attemptPlayback();
    
    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
        videoRef.current.pause();
      }
    };
  }, [reelId]);

  // Listen for reelActive events to control this video's playback
  useEffect(() => {
    const handleReelActive = (e: CustomEvent) => {
      const targetReelId = e.detail.reelId;
      
      if (targetReelId === reelId && videoRef.current) {
        // This is the active reel, ensure it plays
        attemptPlayback();
        
        // Allow unmuting if this is the active reel
        if (!isMuted && videoRef.current) {
          videoRef.current.muted = false;
        }
      } else if (videoRef.current) {
        // This is not the active reel, ensure it's paused and muted
        videoRef.current.pause();
        videoRef.current.muted = true;
        setIsMuted(true);
        setIsPlaying(false);
        if (onPlaybackStatusChange) onPlaybackStatusChange(false);
      }
    };
    
    // Add event listeners for reelActive events
    document.addEventListener('reelActive', handleReelActive as EventListener);
    
    return () => {
      document.removeEventListener('reelActive', handleReelActive as EventListener);
    };
  }, [reelId, isMuted]);

  return {
    isMuted,
    isPlaying,
    toggleMute,
    attemptPlayback
  };
}

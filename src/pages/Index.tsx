import React, { useState, useEffect } from "react";
import VideoReel from "@/components/VideoReel";
import ReelNavigation from "@/components/ReelNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useLiveStreams, LiveStream } from "@/hooks/use-live-streams";

// Base mock reels data
const MOCK_REELS = [
  {
    streamId: "stream-1",
    title: "Nature Beauty in Full Bloom",
    creator: {
      name: "CryptoCreator",
      username: "crypto_creator",
      avatar: "https://i.pravatar.cc/150?img=1",
      followers: 24500,
    },
    viewers: 1254,
    likes: 532,
    dislikes: 21,
    isLive: true,
    thumbnailUrl: "https://source.unsplash.com/featured/1080x1920?nature",
  },
  {
    streamId: "stream-2",
    title: "Fitness Session: Urban Running",
    creator: {
      name: "ArtisticSoul",
      username: "artistic_soul",
      avatar: "https://i.pravatar.cc/150?img=5",
      followers: 18900,
    },
    viewers: 876,
    likes: 342,
    dislikes: 15,
    isLive: true,
    thumbnailUrl: "https://source.unsplash.com/featured/1080x1920?fitness",
  },
  {
    streamId: "stream-3",
    title: "Dance Performance Session",
    creator: {
      name: "BeatMaker",
      username: "beat_maker",
      avatar: "https://i.pravatar.cc/150?img=8",
      followers: 12300,
    },
    viewers: 652,
    likes: 245,
    dislikes: 8,
    isLive: true,
    thumbnailUrl: "https://source.unsplash.com/featured/1080x1920?dance",
  },
  {
    streamId: "stream-4",
    title: "Cooking Stream: Asian Cuisine",
    creator: {
      name: "ChefMaster",
      username: "chef_master",
      avatar: "https://i.pravatar.cc/150?img=4",
      followers: 45200,
    },
    viewers: 2341,
    likes: 892,
    dislikes: 23,
    isLive: true,
    thumbnailUrl: "https://source.unsplash.com/featured/1080x1920?cooking",
  },
  {
    streamId: "stream-5",
    title: "Sunset Yoga Session",
    creator: {
      name: "YogaGuru",
      username: "yoga_guru",
      avatar: "https://i.pravatar.cc/150?img=9",
      followers: 32100,
    },
    viewers: 1567,
    likes: 623,
    dislikes: 12,
    isLive: true,
    thumbnailUrl: "https://source.unsplash.com/featured/1080x1920?yoga",
  }
];

// Mock current user
const CURRENT_USER = {
  username: "current_user"
};

const Index = () => {
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [reels, setReels] = useState(MOCK_REELS);
  const isMobile = useIsMobile();
  const [isInteractingWithUI, setIsInteractingWithUI] = useState(false);
  const { liveStreams, getStreamsByInvitedUser } = useLiveStreams();

  // Convert live streams to reel format and merge with mock reels
  useEffect(() => {
    if (liveStreams.length > 0) {
      // Convert live streams to reel format
      const liveReels = liveStreams.map(stream => ({
        streamId: stream.streamId,
        title: stream.title,
        creator: {
          name: stream.creatorName,
          username: stream.creatorUsername,
          avatar: stream.creatorAvatar,
          followers: 1000, // Default value for now
        },
        viewers: stream.viewers,
        likes: Math.floor(Math.random() * 500) + 100, // Random likes for demo
        dislikes: Math.floor(Math.random() * 20) + 5, // Random dislikes for demo
        isLive: true,
        thumbnailUrl: stream.thumbnailUrl,
      }));

      // Check if user is invited to any streams
      const invitedStreams = getStreamsByInvitedUser(CURRENT_USER.username);
      const invitedStreamIds = invitedStreams.map(stream => stream.streamId);
      
      // Prioritize streams the user is invited to
      const prioritizedReels = [
        ...liveReels.filter(reel => invitedStreamIds.includes(reel.streamId)),
        ...liveReels.filter(reel => !invitedStreamIds.includes(reel.streamId)),
        ...MOCK_REELS.filter(reel => 
          !liveReels.some(liveReel => liveReel.streamId === reel.streamId)
        )
      ];

      setReels(prioritizedReels);
      
      // If the user is invited to streams, show a notification
      if (invitedStreams.length > 0) {
        // This would typically show a toast or other notification
        console.log("You've been invited to join live streams!", invitedStreams);
      }
    }
  }, [liveStreams, getStreamsByInvitedUser]);

  // Enhanced helper function to pause all videos except the active one and manage audio
  const activateCurrentReel = (activeReelId: string) => {
    setTimeout(() => {
      // First pause and mute all videos
      document.querySelectorAll('video').forEach(video => {
        const videoReelId = video.dataset.reelId;
        if (videoReelId !== activeReelId) {
          video.pause();
          video.muted = true;
        }
      });
      
      // Dispatch a custom event to notify the active reel
      const event = new CustomEvent('reelActive', {
        detail: { reelId: activeReelId }
      });
      document.dispatchEvent(event);
    }, 50); // Small delay to ensure DOM is updated
  };

  // Handle manual scrolling between reels
  const handleScroll = (e: React.WheelEvent) => {
    // Check if the user is interacting with any UI elements that should prevent scrolling
    if ((e.target as HTMLElement).closest("[data-prevent-scroll]")) {
      e.stopPropagation();
      return;
    }
    
    if (isInteractingWithUI ||
        (e.target as HTMLElement).closest(".dialog-content") || 
        (e.target as HTMLElement).closest("button") ||
        (e.target as HTMLElement).closest("textarea")) {
      return;
    }
    
    if (e.deltaY > 0) {
      // Scrolling down
      setCurrentReelIndex((prevIndex) => {
        const newIndex = prevIndex === reels.length - 1 ? 0 : prevIndex + 1;
        activateCurrentReel(reels[newIndex].streamId);
        return newIndex;
      });
    } else {
      // Scrolling up
      setCurrentReelIndex((prevIndex) => {
        const newIndex = prevIndex === 0 ? reels.length - 1 : prevIndex - 1;
        activateCurrentReel(reels[newIndex].streamId);
        return newIndex;
      });
    }
  };

  // Handle touch events for mobile
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    // Don't handle touch if element has data-prevent-scroll attribute
    if ((e.target as HTMLElement).closest("[data-prevent-scroll]")) {
      return;
    }
    
    // Don't handle touch if interacting with controls
    if (isInteractingWithUI ||
        (e.target as HTMLElement).closest(".dialog-content") || 
        (e.target as HTMLElement).closest("button") ||
        (e.target as HTMLElement).closest("textarea")) {
      return;
    }
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Don't handle touch if element has data-prevent-scroll attribute
    if ((e.target as HTMLElement).closest("[data-prevent-scroll]")) {
      return;
    }
    
    // Don't handle touch if interacting with controls
    if (isInteractingWithUI ||
        (e.target as HTMLElement).closest(".dialog-content") || 
        (e.target as HTMLElement).closest("button") ||
        (e.target as HTMLElement).closest("textarea")) {
      return;
    }
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // Don't handle touch if element has data-prevent-scroll attribute
    if ((e.target as HTMLElement).closest("[data-prevent-scroll]")) {
      return;
    }
    
    // Don't handle touch end if interacting with controls
    if (isInteractingWithUI ||
        (e.target as HTMLElement).closest(".dialog-content") || 
        (e.target as HTMLElement).closest("button") ||
        (e.target as HTMLElement).closest("textarea")) {
      return;
    }
    
    if (touchStart - touchEnd > 50) {
      // Swipe up - go to next reel
      setCurrentReelIndex((prevIndex) => {
        const newIndex = prevIndex === reels.length - 1 ? 0 : prevIndex + 1;
        activateCurrentReel(reels[newIndex].streamId);
        return newIndex;
      });
    } else if (touchEnd - touchStart > 50) {
      // Swipe down - go to previous reel
      setCurrentReelIndex((prevIndex) => {
        const newIndex = prevIndex === 0 ? reels.length - 1 : prevIndex - 1;
        activateCurrentReel(reels[newIndex].streamId);
        return newIndex;
      });
    }
  };

  const handleNext = () => {
    setCurrentReelIndex((prevIndex) => {
      const newIndex = prevIndex === reels.length - 1 ? 0 : prevIndex + 1;
      activateCurrentReel(reels[newIndex].streamId);
      return newIndex;
    });
  };

  const handlePrevious = () => {
    setCurrentReelIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? reels.length - 1 : prevIndex - 1;
      activateCurrentReel(reels[newIndex].streamId);
      return newIndex;
    });
  };

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        handleNext();
      } else if (e.key === "ArrowUp") {
        handlePrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Set up global event listeners for UI interaction state
  useEffect(() => {
    const handleInteractionStart = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || 
          target.closest('textarea') || 
          target.closest('input') || 
          target.closest('[data-prevent-scroll]')) {
        setIsInteractingWithUI(true);
      }
    };
    
    const handleInteractionEnd = () => setIsInteractingWithUI(false);

    document.addEventListener('mousedown', handleInteractionStart);
    document.addEventListener('mouseup', handleInteractionEnd);
    
    return () => {
      document.removeEventListener('mousedown', handleInteractionStart);
      document.removeEventListener('mouseup', handleInteractionEnd);
    };
  }, []);

  // Ensure only the current reel's video plays when component mounts or index changes
  useEffect(() => {
    if (reels.length > 0) {
      activateCurrentReel(reels[currentReelIndex].streamId);
    }
  }, [currentReelIndex, reels]);

  // Additional effect to focus on the current reel when the page loads
  useEffect(() => {
    // Short timeout to ensure the DOM is fully loaded
    setTimeout(() => {
      if (reels.length > 0) {
        activateCurrentReel(reels[currentReelIndex].streamId);
      }
    }, 300);
  }, [reels]);

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-black text-white flex w-full">
        <div className="flex-1">
          <Navbar />
          <div 
            className="h-screen w-full overflow-hidden"
            onWheel={handleScroll}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className="w-full h-full transition-transform duration-300"
              style={{
                transform: `translateY(-${currentReelIndex * 100}%)`
              }}
            >
              {reels.map((reel, index) => (
                <div 
                  key={reel.streamId} 
                  className={`h-screen w-full video-reel-${index}`}
                >
                  <VideoReel {...reel} />
                </div>
              ))}
            </div>
          </div>
          {!isMobile && <ReelNavigation onNext={handleNext} onPrevious={handlePrevious} />}
        </div>
        
        <style>
          {`
          @keyframes heart-float {
            0% {
              opacity: 0;
              transform: scale(0.5) rotate(var(--rotation));
            }
            25% {
              opacity: 1;
            }
            75% {
              opacity: 1;
              transform: scale(var(--scale)) translateY(-30px) rotate(var(--rotation));
            }
            100% {
              opacity: 0;
              transform: scale(var(--scale)) translateY(-60px) rotate(var(--rotation));
            }
          }
          
          .animate-heart-float {
            animation: heart-float 2s ease-out forwards;
          }
          `}
        </style>
      </div>
    </SidebarProvider>
  );
};

export default Index;

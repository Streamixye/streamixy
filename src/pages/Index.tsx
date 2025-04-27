
import React, { useState, useEffect } from "react";
import VideoReel from "@/components/VideoReel";
import ReelNavigation from "@/components/ReelNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import Navbar from "@/components/Navbar";

// Mock data for demo
const MOCK_REELS = [
  {
    streamId: "stream-1",
    title: "Building a Web3 Metaverse in Real-Time",
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
    thumbnailUrl: "https://source.unsplash.com/featured/1080x1920?gaming",
  },
  {
    streamId: "stream-2",
    title: "Live Pixel Art Creation",
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
    thumbnailUrl: "https://source.unsplash.com/featured/1080x1920?art",
  },
  {
    streamId: "stream-3",
    title: "Music Production Session",
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
    thumbnailUrl: "https://source.unsplash.com/featured/1080x1920?music",
  },
  {
    streamId: "stream-4",
    title: "Cooking Stream: Italian Pasta",
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

const Index = () => {
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const isMobile = useIsMobile();

  // Handle manual scrolling between reels
  const handleScroll = (e: React.WheelEvent) => {
    e.stopPropagation();
    
    // Only change reels if not interacting with controls
    if ((e.target as HTMLElement).closest(".dialog-content") || 
        (e.target as HTMLElement).closest("button")) {
      return;
    }
    
    if (e.deltaY > 0) {
      // Scrolling down
      setCurrentReelIndex((prevIndex) =>
        prevIndex === MOCK_REELS.length - 1 ? 0 : prevIndex + 1
      );
    } else {
      // Scrolling up
      setCurrentReelIndex((prevIndex) =>
        prevIndex === 0 ? MOCK_REELS.length - 1 : prevIndex - 1
      );
    }
  };

  // Handle touch events for mobile
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    // Don't handle touch if interacting with controls
    if ((e.target as HTMLElement).closest(".dialog-content") || 
        (e.target as HTMLElement).closest("button")) {
      return;
    }
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Don't handle touch if interacting with controls
    if ((e.target as HTMLElement).closest(".dialog-content") || 
        (e.target as HTMLElement).closest("button")) {
      return;
    }
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // Don't handle touch end if interacting with controls
    if ((e.target as HTMLElement).closest(".dialog-content") || 
        (e.target as HTMLElement).closest("button")) {
      return;
    }
    
    if (touchStart - touchEnd > 50) {
      // Swipe up - go to next reel
      setCurrentReelIndex((prevIndex) =>
        prevIndex === MOCK_REELS.length - 1 ? 0 : prevIndex + 1
      );
    } else if (touchEnd - touchStart > 50) {
      // Swipe down - go to previous reel
      setCurrentReelIndex((prevIndex) =>
        prevIndex === 0 ? MOCK_REELS.length - 1 : prevIndex - 1
      );
    }
  };

  const handleNext = () => {
    setCurrentReelIndex((prevIndex) =>
      prevIndex === MOCK_REELS.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevious = () => {
    setCurrentReelIndex((prevIndex) =>
      prevIndex === 0 ? MOCK_REELS.length - 1 : prevIndex - 1
    );
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

  return (
    <div className="min-h-screen bg-black text-white">
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
          {MOCK_REELS.map((reel, index) => (
            <div key={reel.streamId} className="h-screen w-full">
              <VideoReel {...reel} />
            </div>
          ))}
        </div>
      </div>
      {!isMobile && <ReelNavigation onNext={handleNext} onPrevious={handlePrevious} />}
    </div>
  );
};

export default Index;

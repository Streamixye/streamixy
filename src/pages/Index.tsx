
import React, { useState } from "react";
import VideoReel from "@/components/VideoReel";
import Navbar from "@/components/Navbar";
import ReelNavigation from "@/components/ReelNavigation";

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

  const handleNextReel = () => {
    setCurrentReelIndex((prevIndex) =>
      prevIndex === MOCK_REELS.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePreviousReel = () => {
    setCurrentReelIndex((prevIndex) =>
      prevIndex === 0 ? MOCK_REELS.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="h-screen w-full flex items-center justify-center">
        <div className="w-full max-w-md h-full pt-16 pb-4">
          <VideoReel {...MOCK_REELS[currentReelIndex]} />
        </div>
      </div>
      
      <ReelNavigation
        onNext={handleNextReel}
        onPrevious={handlePreviousReel}
      />
      
      {/* Navigation indicators */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 flex space-x-1.5">
        {MOCK_REELS.map((_, index) => (
          <div 
            key={index}
            className={`h-1 w-4 rounded-full transition-all duration-300 ${
              index === currentReelIndex 
                ? "bg-streamixy-primary w-6" 
                : "bg-gray-500/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Index;

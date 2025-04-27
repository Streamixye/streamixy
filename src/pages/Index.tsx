
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
    thumbnailUrl: "https://source.unsplash.com/featured/1080x1920?tech",
  },
  {
    streamId: "stream-2",
    title: "Trading Crypto Live: Market Analysis",
    creator: {
      name: "TradingQueen",
      username: "trading_queen",
      avatar: "https://i.pravatar.cc/150?img=5",
      followers: 18900,
    },
    viewers: 876,
    likes: 342,
    dislikes: 15,
    isLive: true,
    thumbnailUrl: "https://source.unsplash.com/featured/1080x1920?crypto",
  },
  {
    streamId: "stream-3",
    title: "NFT Art Creation Session",
    creator: {
      name: "DigitalArtist",
      username: "digital_artist",
      avatar: "https://i.pravatar.cc/150?img=8",
      followers: 12300,
    },
    viewers: 652,
    likes: 245,
    dislikes: 8,
    isLive: false,
    thumbnailUrl: "https://source.unsplash.com/featured/1080x1920?art",
  },
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
    <div className="min-h-screen bg-streamixy-dark text-white">
      <Navbar />
      
      <div className="h-screen w-full flex items-center justify-center">
        <div className="w-full max-w-md h-full max-h-[80vh] pt-16 pb-4">
          <VideoReel {...MOCK_REELS[currentReelIndex]} />
        </div>
      </div>
      
      <ReelNavigation
        onNext={handleNextReel}
        onPrevious={handlePreviousReel}
      />
      
      {/* Navigation indicators */}
      <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-40 flex space-x-2">
        {MOCK_REELS.map((_, index) => (
          <div 
            key={index}
            className={`h-2 w-2 rounded-full ${
              index === currentReelIndex 
                ? "bg-streamixy-primary" 
                : "bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Index;

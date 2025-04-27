
import React, { useState } from "react";
import { Play, Gift, Share, Vote } from "lucide-react";
import { Button } from "@/components/ui/button";
import VoteButton from "./VoteButton";
import CreatorInfo from "./CreatorInfo";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";

interface VideoReelProps {
  streamId: string;
  title: string;
  creator: {
    name: string;
    username: string;
    avatar: string;
    followers: number;
  };
  viewers: number;
  likes: number;
  dislikes: number;
  isLive: boolean;
  thumbnailUrl: string;
}

const VideoReel: React.FC<VideoReelProps> = ({
  streamId,
  title,
  creator,
  viewers,
  isLive,
  thumbnailUrl,
}) => {
  const { toast } = useToast();
  const [creatorTokens, setCreatorTokens] = useState(0);
  const isMobile = useIsMobile();
  
  // Gift items and their values
  const giftItems = [
    { id: 1, name: "Flower", value: 5, emoji: "🌹" },
    { id: 2, name: "Lion", value: 50, emoji: "🦁" },
    { id: 3, name: "Crown", value: 100, emoji: "👑" },
    { id: 4, name: "Diamond", value: 500, emoji: "💎" }
  ];
  
  const handleVote = (amount: number) => {
    setCreatorTokens(prev => prev + amount);
    toast({
      title: "Tokens Sent!",
      description: `You voted ${amount} SYX tokens to ${creator.name}`,
    });
  };
  
  const handleGift = (gift: { name: string; value: number; emoji: string }) => {
    setCreatorTokens(prev => prev + gift.value);
    
    // Create gift animation
    const giftElement = document.createElement("div");
    giftElement.innerText = gift.emoji;
    giftElement.className = "fixed text-4xl z-50 animate-float";
    giftElement.style.left = `${Math.random() * 80 + 10}%`;
    giftElement.style.bottom = "0";
    document.body.appendChild(giftElement);
    
    // Remove the element after animation
    setTimeout(() => {
      document.body.removeChild(giftElement);
    }, 3000);
    
    toast({
      title: "Gift Sent!",
      description: `You gifted a ${gift.name} (${gift.value} SYX) to ${creator.name}`,
    });
  };
  
  const shareOptions = [
    { name: "WhatsApp", icon: "whatsapp", color: "#25D366" },
    { name: "Facebook", icon: "facebook", color: "#1877F2" },
    { name: "Instagram", icon: "instagram", color: "#E4405F" },
    { name: "Telegram", icon: "telegram", color: "#0088cc" }
  ];
  
  const handleShare = (platform: string) => {
    toast({
      title: "Sharing",
      description: `Sharing to ${platform}...`,
    });
    // In a real app, we would implement actual sharing functionality here
  };
  
  return (
    <div className="relative w-full h-full flex">
      <div className="video-container w-full h-full bg-black">
        {/* Video Placeholder or Thumbnail */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${thumbnailUrl})` }}
        />
        
        {/* Overlay for dim effect */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Video Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-16 w-16 rounded-full bg-streamixy-primary/30 hover:bg-streamixy-primary/50 transition-all duration-300"
          >
            <Play className="h-8 w-8 text-white" />
          </Button>
        </div>

        {/* Live Indicator */}
        {isLive && (
          <div className="absolute top-4 left-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1 animate-pulse">
            <span className="h-2 w-2 bg-white rounded-full"></span>
            <span>LIVE</span>
          </div>
        )}

        {/* Creator Info with Tokens */}
        <div className="absolute bottom-24 left-4 animate-slide-up">
          <CreatorInfo creator={creator} />
          {/* Real-time token display */}
          <div className="mt-2 bg-streamixy-primary/50 rounded-full px-3 py-1 text-xs text-white inline-flex items-center">
            <span className="font-bold mr-1">SYX:</span> {creatorTokens}
          </div>
        </div>

        {/* Stream Title */}
        <div className="absolute bottom-44 left-4 max-w-[80%]">
          <h3 className="text-lg font-bold text-white glow-text">{title}</h3>
        </div>

        {/* Viewer Count */}
        <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full flex items-center space-x-1">
          <span className="text-xs text-white">{viewers} viewers</span>
        </div>

        {/* Interaction Buttons */}
        <div className={`absolute ${isMobile ? 'right-2' : 'right-4'} bottom-1/3 flex flex-col space-y-6`}>
          {/* Vote Button - Opens Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <div>
                <VoteButton
                  icon={<Vote className="h-6 w-6" />}
                  label="Vote"
                />
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Vote SYX Tokens</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col space-y-4 py-4">
                <p className="text-sm text-muted-foreground">
                  Send SYX tokens to support {creator.name}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[10, 50, 100, 500, 1000].map((amount) => (
                    <Button 
                      key={amount} 
                      className="bg-streamixy-highlight hover:bg-streamixy-highlight/80"
                      onClick={() => handleVote(amount)}
                    >
                      {amount} SYX
                    </Button>
                  ))}
                </div>
                <div className="flex space-x-2 items-center mt-4">
                  <Input 
                    type="number" 
                    placeholder="Custom amount" 
                    className="flex-1" 
                    min={1}
                    id="custom-amount"
                  />
                  <Button 
                    onClick={() => {
                      const input = document.getElementById('custom-amount') as HTMLInputElement;
                      const value = parseInt(input.value);
                      if (value && value > 0) {
                        handleVote(value);
                      }
                    }}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Gift Button - Opens Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <div>
                <VoteButton
                  icon={<Gift className="h-6 w-6" />}
                  label="Gift"
                />
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Gifts</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col space-y-4 py-4">
                <p className="text-sm text-muted-foreground">
                  Send gifts to {creator.name}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {giftItems.map((gift) => (
                    <Button 
                      key={gift.id} 
                      variant="outline" 
                      className="h-auto flex flex-col p-4 items-center"
                      onClick={() => handleGift(gift)}
                    >
                      <span className="text-3xl mb-2">{gift.emoji}</span>
                      <span className="text-sm">{gift.name}</span>
                      <span className="text-xs text-muted-foreground mt-1">{gift.value} SYX</span>
                    </Button>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Share Button - Opens Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <div>
                <VoteButton
                  icon={<Share className="h-6 w-6" />}
                  label="Share"
                />
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Stream</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col space-y-4 py-4">
                <p className="text-sm text-muted-foreground">
                  Share {creator.name}'s stream
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {shareOptions.map((option) => (
                    <Button 
                      key={option.name} 
                      variant="outline" 
                      className="h-auto flex flex-col p-4 items-center"
                      onClick={() => handleShare(option.name)}
                      style={{ 
                        borderColor: option.color,
                        color: option.color 
                      }}
                    >
                      <span className="text-sm">{option.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default VideoReel;

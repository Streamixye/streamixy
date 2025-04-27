
import React, { useState, useRef, useEffect } from "react";
import { Play, Gift, Share, MessagesSquare, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import VoteButton from "./VoteButton";
import CreatorInfo from "./CreatorInfo";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import SearchDialog from "./SearchDialog";

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
  creator,
  viewers,
  isLive,
  thumbnailUrl,
}) => {
  const { toast } = useToast();
  const [creatorTokens, setCreatorTokens] = useState(0);
  const isMobile = useIsMobile();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [comments, setComments] = useState<{text: string, id: number}[]>([]);
  const [activeComment, setActiveComment] = useState<{text: string, id: number} | null>(null);
  const [nextCommentId, setNextCommentId] = useState(1);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [voteAmount, setVoteAmount] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && videoRef.current) {
            videoRef.current.play().catch(error => {
              console.log("Auto-play prevented:", error);
            });
          } else if (!entry.isIntersecting && videoRef.current) {
            videoRef.current.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  const giftItems = [
    { id: 1, name: "Flower", value: 5, emoji: "🌹" },
    { id: 2, name: "Lion", value: 50, emoji: "🦁" },
    { id: 3, name: "Crown", value: 100, emoji: "👑" },
    { id: 4, name: "Diamond", value: 500, emoji: "💎" }
  ];

  const handleVote = (amount: number) => {
    setCreatorTokens(prev => prev + amount);
    
    // Show animation for token sending
    const tokenElement = document.createElement("div");
    tokenElement.innerText = `+${amount}`;
    tokenElement.className = "fixed text-xl font-bold text-streamixy-primary z-50 animate-float";
    tokenElement.style.left = `${Math.random() * 80 + 10}%`;
    tokenElement.style.bottom = "0";
    document.body.appendChild(tokenElement);
    
    setTimeout(() => {
      document.body.removeChild(tokenElement);
    }, 3000);
    
    toast({
      title: "Tokens Sent!",
      description: `You voted ${amount} SYX tokens to ${creator.name}`,
    });
    
    // Close dialog after voting
    const closeButton = document.querySelector("[data-vote-dialog] .close-dialog") as HTMLButtonElement;
    if (closeButton) closeButton.click();
  };

  const handleCustomVote = () => {
    const value = parseInt(voteAmount);
    if (value && value > 0) {
      handleVote(value);
      setVoteAmount("");
    } else {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid number of tokens",
        variant: "destructive"
      });
    }
  };

  const handleGift = (gift: { name: string; value: number; emoji: string }) => {
    setCreatorTokens(prev => prev + gift.value);
    
    // Create animated gift element
    const giftElement = document.createElement("div");
    giftElement.innerText = gift.emoji;
    giftElement.className = "fixed text-4xl z-50 animate-float";
    giftElement.style.left = `${Math.random() * 80 + 10}%`;
    giftElement.style.bottom = "0";
    document.body.appendChild(giftElement);
    
    setTimeout(() => {
      document.body.removeChild(giftElement);
    }, 3000);
    
    toast({
      title: "Gift Sent!",
      description: `You gifted a ${gift.name} (${gift.value} SYX) to ${creator.name}`,
    });
    
    // Close dialog after gifting
    const closeButton = document.querySelector("[data-gift-dialog] .close-dialog") as HTMLButtonElement;
    if (closeButton) closeButton.click();
  };

  const shareOptions = [
    { name: "WhatsApp", icon: "whatsapp", color: "#25D366" },
    { name: "Facebook", icon: "facebook", color: "#1877F2" },
    { name: "Instagram", icon: "instagram", color: "#E4405F" },
    { name: "Twitter", icon: "twitter", color: "#1DA1F2" }
  ];

  const handleShare = (platform: string) => {
    // Simulate share functionality
    const shareUrl = `https://streamixy.com/watch/${streamId}`;
    let shareEndpoint = "";
    
    switch (platform.toLowerCase()) {
      case "whatsapp":
        shareEndpoint = `https://api.whatsapp.com/send?text=Check out this amazing stream: ${shareUrl}`;
        break;
      case "facebook":
        shareEndpoint = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
        break;
      case "twitter":
        shareEndpoint = `https://twitter.com/intent/tweet?text=Check out this amazing stream&url=${shareUrl}`;
        break;
      case "instagram":
        // Instagram doesn't have a direct share URL, so we'll just show a toast
        break;
    }
    
    if (shareEndpoint) {
      window.open(shareEndpoint, "_blank", "noopener,noreferrer");
    }
    
    toast({
      title: "Sharing",
      description: `Sharing to ${platform}...`,
    });
    
    // Close dialog after sharing
    const closeButton = document.querySelector("[data-share-dialog] .close-dialog") as HTMLButtonElement;
    if (closeButton) closeButton.click();
  };

  const handleComment = (text: string) => {
    if (!text.trim()) return;
    
    const newComment = { text, id: nextCommentId };
    setNextCommentId(prev => prev + 1);
    setComments(prev => [...prev, newComment]);
    setActiveComment(newComment);
    
    setTimeout(() => {
      setActiveComment(null);
    }, 3000);
    
    toast({
      title: "Comment Posted!",
      description: "Your comment is now visible on stream",
    });
  };

  const handleRequest = (request: string) => {
    if (!request.trim()) return;
    
    toast({
      title: "Request Sent",
      description: `Your request to join ${creator.name} live has been sent!`,
    });
    
    // Close dialog after sending request
    const closeButton = document.querySelector("[data-request-dialog] .close-dialog") as HTMLButtonElement;
    if (closeButton) closeButton.click();
  };

  const stopAllPropagation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="relative w-full h-full flex" onClick={(e) => e.stopPropagation()}>
      <div className="video-container w-full h-full bg-black">
        <video
          ref={videoRef}
          className="absolute inset-0 object-cover w-full h-full"
          muted
          loop
          playsInline
          poster={thumbnailUrl}
          preload="auto"
        >
          <source src={`https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        <div className="absolute inset-0 bg-black/20" />

        {isLive && (
          <div className="absolute top-4 left-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1 animate-pulse">
            <span className="h-2 w-2 bg-white rounded-full"></span>
            <span>LIVE</span>
          </div>
        )}

        <div className="absolute bottom-24 left-4 animate-slide-up">
          <div className="flex items-center bg-black/50 backdrop-blur-md rounded-lg py-1.5 px-3 border border-white/10">
            <span className="text-white text-sm font-medium mr-2">{creator.name}</span>
            <Avatar className="h-8 w-8 border-2 border-streamixy-primary">
              <AvatarImage src={creator.avatar} alt={creator.name} />
              <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-2">
              <div className="flex items-center">
                <span className="text-streamixy-primary text-xs font-bold">SYX:</span>
                <span className="ml-1 text-white text-xs">{creatorTokens}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full flex items-center space-x-1">
          <span className="text-xs text-white">{viewers} viewers</span>
        </div>

        {activeComment && (
          <div className="absolute bottom-48 left-4 max-w-[80%] animate-fade-in glass px-4 py-2 rounded-lg">
            <p className="text-white text-sm">{activeComment.text}</p>
          </div>
        )}

        <div 
          className="absolute right-4 bottom-32 flex flex-col space-y-6"
          onClick={stopAllPropagation}
        >
          <div className="flex flex-col items-center space-y-6">
            <Dialog>
              <DialogTrigger asChild>
                <div onClick={stopAllPropagation}>
                  <VoteButton
                    icon={<MessagesSquare className="h-7 w-7" />}
                    label="Vote"
                  />
                </div>
              </DialogTrigger>
              <DialogContent data-vote-dialog onClick={stopAllPropagation} className="dialog-content bg-black/90 border border-white/10 text-white">
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVote(amount);
                        }}
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
                      value={voteAmount}
                      onChange={(e) => setVoteAmount(e.target.value)}
                    />
                    <Button 
                      onClick={() => handleCustomVote()}
                    >
                      Send
                    </Button>
                  </div>
                </div>
                <Button className="close-dialog hidden" />
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <div onClick={stopAllPropagation}>
                  <VoteButton
                    icon={<Gift className="h-7 w-7" />}
                    label="Gift"
                  />
                </div>
              </DialogTrigger>
              <DialogContent data-gift-dialog onClick={stopAllPropagation} className="dialog-content bg-black/90 border border-white/10 text-white">
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGift(gift);
                        }}
                      >
                        <span className="text-3xl mb-2">{gift.emoji}</span>
                        <span className="text-sm">{gift.name}</span>
                        <span className="text-xs text-muted-foreground mt-1">{gift.value} SYX</span>
                      </Button>
                    ))}
                  </div>
                </div>
                <Button className="close-dialog hidden" />
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <div onClick={stopAllPropagation}>
                  <VoteButton
                    icon={<Share className="h-7 w-7" />}
                    label="Share"
                  />
                </div>
              </DialogTrigger>
              <DialogContent data-share-dialog onClick={stopAllPropagation} className="dialog-content bg-black/90 border border-white/10 text-white">
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(option.name);
                        }}
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
                <Button className="close-dialog hidden" />
              </DialogContent>
            </Dialog>

            <button 
              className="bg-black/40 backdrop-blur-sm p-3 rounded-full hover:bg-streamixy-primary/30 transition-all"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-7 w-7 text-white" />
              <span className="text-[8px] text-white/70 mt-0.5">Search</span>
            </button>
            
            <Dialog>
              <DialogTrigger asChild>
                <div onClick={stopAllPropagation}>
                  <VoteButton
                    icon={<MessagesSquare className="h-7 w-7" />}
                    label="Request"
                  />
                </div>
              </DialogTrigger>
              <DialogContent data-request-dialog onClick={stopAllPropagation} className="dialog-content bg-black/90 border border-white/10 text-white">
                <DialogHeader>
                  <DialogTitle>Send Request</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col space-y-4 py-4">
                  <p className="text-sm text-muted-foreground">
                    Send a request to join {creator.name}'s live stream
                  </p>
                  <Textarea 
                    placeholder="Type your request here..."
                    className="min-h-[100px] bg-white/10 border-white/20 text-white"
                    id="request-input"
                  />
                  <Button 
                    onClick={() => {
                      const textarea = document.getElementById('request-input') as HTMLTextAreaElement;
                      handleRequest(textarea.value);
                      textarea.value = '';
                    }}
                    className="bg-streamixy-primary hover:bg-streamixy-primary/80"
                  >
                    Send Request
                  </Button>
                </div>
                <Button className="close-dialog hidden" />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <SearchDialog 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
};

export default VideoReel;

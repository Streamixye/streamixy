import React, { useState, useRef, useEffect } from "react";
import { Gift, Search, Share, Heart } from "lucide-react";
import VoteButton from "./VoteButton";
import { useToast } from "@/hooks/use-toast";
import { useTokens, TokenTransaction } from "@/hooks/use-tokens";
import TokenVoteDialog from "./TokenVoteDialog";
import GiftDialog from "./GiftDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import SearchDialog from "./SearchDialog";
import VideoContainer from "./video/VideoContainer";
import CreatorDisplay from "./video/CreatorDisplay";
import CommentSection from "./video/CommentSection";
import ActionButtons from "./video/ActionButtons";

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
  const { tokenBalance, handleTransaction } = useTokens(creator.name);
  const [creatorTokens, setCreatorTokens] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVoteDialogOpen, setIsVoteDialogOpen] = useState(false);
  const [isGiftDialogOpen, setIsGiftDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [voteAmount, setVoteAmount] = useState("");
  const [requestStatus, setRequestStatus] = useState<"idle" | "pending" | "accepted" | "rejected">("idle");
  const [displayedViewers, setDisplayedViewers] = useState(viewers);
  const [likeAnimations, setLikeAnimations] = useState<{id: number, x: number, y: number}[]>([]);
  const [likeCounter, setLikeCounter] = useState(0);
  const [lastTap, setLastTap] = useState<number>(0);
  const [likesCount, setLikesCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const isMobile = useIsMobile();

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

  // Animate viewer count
  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        const increase = Math.floor(Math.random() * 3) + 1;
        setDisplayedViewers(prev => prev + increase);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isLive]);

  const handleTokenTransaction = (transaction: TokenTransaction) => {
    if (handleTransaction(transaction)) {
      setCreatorTokens(prev => prev + transaction.amount);
      
      const element = document.createElement("div");
      element.innerText = `+${transaction.amount}`;
      element.className = "fixed text-xl font-bold text-streamixy-primary z-50 animate-float";
      element.style.left = `${Math.random() * 80 + 10}%`;
      element.style.bottom = "0";
      document.body.appendChild(element);
      
      setTimeout(() => {
        document.body.removeChild(element);
      }, 3000);
    }
  };

  const stopAllPropagation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const giftItems = [
    { id: 1, name: "Flower", value: 5, emoji: "🌹" },
    { id: 2, name: "Lion", value: 50, emoji: "🦁" },
    { id: 3, name: "Crown", value: 100, emoji: "👑" },
    { id: 4, name: "Diamond", value: 500, emoji: "💎" }
  ];

  const handleVote = (amount: number) => {
    setCreatorTokens(prev => prev + amount);
    
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
    
    const closeVoteDialog = document.querySelector("[data-vote-dialog] button[data-dialog-close]") as HTMLButtonElement;
    if (closeVoteDialog) closeVoteDialog.click();
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
    
    const closeGiftDialog = document.querySelector("[data-gift-dialog] button[data-dialog-close]") as HTMLButtonElement;
    if (closeGiftDialog) closeGiftDialog.click();
  };

  // Update the share options to use white text color for all platforms
  const shareOptions = [
    { name: "WhatsApp", icon: "whatsapp", color: "#25D366" },
    { name: "Telegram", icon: "telegram", color: "#0088cc" },
    { name: "Facebook", icon: "facebook", color: "#1877F2" },
    { name: "Twitter", icon: "twitter", color: "#1DA1F2" }
  ];

  const handleShare = (platform: string) => {
    const shareUrl = `https://streamixy.com/watch/${streamId}`;
    let shareEndpoint = "";
    
    switch (platform.toLowerCase()) {
      case "whatsapp":
        shareEndpoint = `https://api.whatsapp.com/send?text=Check out this amazing stream: ${shareUrl}`;
        break;
      case "telegram":
        shareEndpoint = `https://t.me/share/url?url=${shareUrl}&text=Check out this amazing stream`;
        break;
      case "facebook":
        shareEndpoint = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
        break;
      case "twitter":
        shareEndpoint = `https://twitter.com/intent/tweet?text=Check out this amazing stream&url=${shareUrl}`;
        break;
    }
    
    if (shareEndpoint) {
      window.open(shareEndpoint, "_blank", "noopener,noreferrer");
    }
    
    toast({
      title: "Sharing",
      description: `Sharing to ${platform}...`,
    });
    
    setIsShareDialogOpen(false);
  };

  // Implement manual like function - removed toast notification
  const handleManualLike = () => {
    // Increment likes count
    setLikesCount(prev => prev + 1);
    
    // Show heart animation in the middle of the screen
    const centerX = 50;
    const centerY = 50;
    createLikeAnimation(centerX, centerY);
  };

  // Enhanced double-tap like handler
  const handleTap = (e: React.TouchEvent) => {
    if (!videoRef.current) return;
    
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    const isDoubleTap = tapLength < 300 && tapLength > 0;
    
    setLastTap(currentTime);
    
    if (isDoubleTap) {
      // Prevent default behavior
      e.preventDefault();
      
      // Calculate position for like animation
      const touch = e.touches[0] || e.changedTouches[0];
      const rect = videoRef.current.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * 100;
      const y = ((touch.clientY - rect.top) / rect.height) * 100;
      
      createLikeAnimation(x, y);
    }
  };
  
  // Handle direct double click for desktop users - removed toast notification
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!videoRef.current) return;
    
    // Prevent default behavior to avoid issues
    e.preventDefault();
    
    // Get position relative to the video element
    const rect = videoRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Increment likes count
    setLikesCount(prev => prev + 1);
    
    createLikeAnimation(x, y);
  };
  
  const createLikeAnimation = (x: number, y: number) => {
    // Generate a new like animation at this position
    const newLike = {
      id: likeCounter,
      x,
      y
    };
    
    setLikeAnimations(prev => [...prev, newLike]);
    setLikeCounter(prev => prev + 1);
    
    // Remove the like animation after it completes
    setTimeout(() => {
      setLikeAnimations(prev => prev.filter(like => like.id !== newLike.id));
    }, 1500);
  };

  // Handle follow action
  const handleFollow = (followed: boolean) => {
    setIsFollowing(followed);
    
    // You might want to save this state to local storage or a database
    localStorage.setItem(`following_${creator.username}`, followed ? 'true' : 'false');
    
    // If we were connected to a backend, we would update the creator's followers count
    // For now, we'll just show a toast notification
    toast({
      title: followed ? "Following!" : "Unfollowed",
      description: followed 
        ? `You are now following ${creator.name}` 
        : `You unfollowed ${creator.name}`,
    });
  };

  const handleRequest = () => {
    setRequestStatus("pending");
    
    toast({
      title: "Request Sent",
      description: `Your request to join ${creator.name}'s live has been sent!`,
    });
    
    // Simulate creator responding after a delay
    setTimeout(() => {
      const isAccepted = Math.random() > 0.5; // Randomly accept or reject for demo
      
      if (isAccepted) {
        setRequestStatus("accepted");
        toast({
          title: "Request Accepted!",
          description: `${creator.name} has accepted your request to join the stream!`,
        });
      } else {
        setRequestStatus("rejected");
        toast({
          variant: "destructive",
          title: "Request Rejected",
          description: `${creator.name} has rejected your request to join the stream.`,
        });
      }
      
      // Reset status after notification
      setTimeout(() => {
        setRequestStatus("idle");
      }, 5000);
      
    }, 3000);
  };

  return (
    <div className="relative w-full h-full flex" onClick={(e) => e.stopPropagation()}>
      <div className="video-container w-full h-full bg-black">
        <VideoContainer 
          videoRef={videoRef}
          thumbnailUrl={thumbnailUrl}
          handleDoubleClick={handleDoubleClick}
          handleTap={handleTap}
          isLive={isLive}
          likeAnimations={likeAnimations}
          displayedViewers={displayedViewers}
        />

        <CreatorDisplay 
          creatorName={creator.name}
          creatorAvatar={creator.avatar}
          creatorTokens={creatorTokens}
        />

        <CommentSection 
          onLike={handleManualLike}
          onFollow={handleFollow}
          creatorName={creator.name}
        />

        <ActionButtons 
          onVoteClick={() => setIsVoteDialogOpen(true)}
          onGiftClick={() => setIsGiftDialogOpen(true)}
          onShareClick={() => setIsShareDialogOpen(true)}
          onSearchClick={() => setIsSearchOpen(true)}
          onRequestClick={handleRequest}
          requestStatus={requestStatus}
          stopAllPropagation={stopAllPropagation}
        />
      </div>

      <TokenVoteDialog
        isOpen={isVoteDialogOpen}
        onClose={() => setIsVoteDialogOpen(false)}
        onVote={handleTokenTransaction}
        creatorName={creator.name}
        tokenBalance={tokenBalance}
      />

      <GiftDialog
        isOpen={isGiftDialogOpen}
        onClose={() => setIsGiftDialogOpen(false)}
        onGift={handleTokenTransaction}
        creatorName={creator.name}
        tokenBalance={tokenBalance}
      />

      <SearchDialog 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="bg-black/90 border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Share Stream</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 p-4">
            {shareOptions.map((option) => (
              <Button 
                key={option.name}
                variant="outline"
                className="bg-transparent border border-white/20 text-white hover:bg-white/10"
                onClick={() => handleShare(option.name)}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" 
                       style={{backgroundColor: option.color}}>
                    <span className="text-xl">{option.icon === "whatsapp" ? "📱" : 
                                                option.icon === "telegram" ? "✈️" : 
                                                option.icon === "facebook" ? "👍" : "🐦"}</span>
                  </div>
                  <span className="text-white font-medium">{option.name}</span>
                </div>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Request status display */}
      {requestStatus !== "idle" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-black/90 p-6 rounded-lg border border-white/10 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Request Status</h2>
            
            {requestStatus === "pending" && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto mb-4"></div>
                <p>Sending request to {creator.name}...</p>
              </div>
            )}
            
            {requestStatus === "accepted" && (
              <div className="text-center">
                <div className="text-green-500 text-6xl mb-4">✓</div>
                <p className="mb-4">Your request has been accepted!</p>
                <Button 
                  onClick={() => setRequestStatus("idle")}
                  className="bg-streamixy-primary hover:bg-streamixy-primary/80"
                >
                  Close
                </Button>
              </div>
            )}
            
            {requestStatus === "rejected" && (
              <div className="text-center">
                <div className="text-red-500 text-6xl mb-4">✕</div>
                <p className="mb-4">Your request has been rejected.</p>
                <Button 
                  onClick={() => setRequestStatus("idle")}
                  className="bg-streamixy-primary hover:bg-streamixy-primary/80"
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>
        {`
        @keyframes float {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px);
            opacity: 0;
          }
        }
        
        @keyframes like-float {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.5);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -80%) scale(1);
          }
        }
        
        .animate-float {
          animation: float 3s ease-out forwards;
        }
        
        .animate-like-float {
          animation: like-float 1.5s ease-out forwards;
        }
        
        .glass {
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        `}
      </style>
    </div>
  );
};

export default VideoReel;

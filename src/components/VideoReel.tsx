import React, { useState, useRef, useEffect } from "react";
import { Gift, MessageSquare, Search, Share, Heart } from "lucide-react";
import VoteButton from "./VoteButton";
import { useToast } from "@/hooks/use-toast";
import { useTokens, TokenTransaction } from "@/hooks/use-tokens";
import TokenVoteDialog from "./TokenVoteDialog";
import GiftDialog from "./GiftDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import SearchDialog from "./SearchDialog";
import LiveComment from "./LiveComment";

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
  const [comments, setComments] = useState<{text: string, id: number, username: string}[]>([]);
  const [activeComment, setActiveComment] = useState<{text: string, id: number, username: string} | null>(null);
  const [nextCommentId, setNextCommentId] = useState(1);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVoteDialogOpen, setIsVoteDialogOpen] = useState(false);
  const [isGiftDialogOpen, setIsGiftDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [voteAmount, setVoteAmount] = useState("");
  const [commentText, setCommentText] = useState("");
  const [requestStatus, setRequestStatus] = useState<"idle" | "pending" | "accepted" | "rejected">("idle");
  const [displayedViewers, setDisplayedViewers] = useState(viewers);
  const [likeAnimations, setLikeAnimations] = useState<{id: number, x: number, y: number}[]>([]);
  const [likeCounter, setLikeCounter] = useState(0);
  const [lastTap, setLastTap] = useState<number>(0);
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

  const handleComment = () => {
    if (!commentText.trim()) return;
    
    // Add to local comments
    const newComment = { text: commentText, id: nextCommentId, username: "You" };
    setNextCommentId(prev => prev + 1);
    setComments(prev => [...prev, newComment]);
    setActiveComment(newComment);
    
    // Show the comment in the UI
    toast({
      title: "Comment Posted!",
      description: "Your comment is now visible on stream",
    });
    
    // Clear the input field
    setCommentText("");
    
    // Close the comment dialog
    setIsCommentDialogOpen(false);
    
    // Remove the comment after a while
    setTimeout(() => {
      setActiveComment(null);
      setComments(prev => prev.filter(comment => comment.id !== newComment.id));
    }, 5000);
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
  
  // Handle direct double click for desktop users
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!videoRef.current) return;
    
    // Prevent default behavior to avoid issues
    e.preventDefault();
    
    // Get position relative to the video element
    const rect = videoRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
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

  return (
    <div className="relative w-full h-full flex" onClick={(e) => e.stopPropagation()}>
      <div className="video-container w-full h-full bg-black">
        <video
          ref={videoRef}
          className="absolute inset-0 object-cover w-full h-full"
          onDoubleClick={handleDoubleClick}
          onTouchStart={handleTap}
          muted
          loop
          playsInline
          poster={thumbnailUrl}
          preload="auto"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        <div className="absolute inset-0 bg-black/20" />

        {/* Like animations */}
        {likeAnimations.map(like => (
          <div 
            key={like.id}
            className="absolute animate-like-float"
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
          <span className="text-xs text-white animate-pulse">{displayedViewers} viewers</span>
        </div>

        {/* Display comments in the stream */}
        <div className="absolute left-4 right-4 top-16 bottom-32 overflow-hidden pointer-events-none">
          {comments.map((comment) => (
            <LiveComment 
              key={comment.id} 
              username={comment.username} 
              text={comment.text} 
              position={comment.username === "You" ? "right" : "left"}
            />
          ))}
        </div>

        <div 
          className="absolute right-4 bottom-32 flex flex-col space-y-6"
          onClick={stopAllPropagation}
        >
          <div className="flex flex-col items-center space-y-6">
            <div onClick={(e) => {
              e.stopPropagation();
              setIsCommentDialogOpen(true);
            }}>
              <VoteButton
                icon={<MessageSquare className="h-7 w-7" />}
                label="Comment"
              />
            </div>

            <div onClick={(e) => e.stopPropagation()}>
              <VoteButton
                icon={<MessageSquare className="h-7 w-7" />}
                label="Vote"
                onClick={() => setIsVoteDialogOpen(true)}
              />
            </div>

            <div onClick={(e) => e.stopPropagation()}>
              <VoteButton
                icon={<Gift className="h-7 w-7" />}
                label="Gift"
                onClick={() => setIsGiftDialogOpen(true)}
              />
            </div>

            <div onClick={(e) => e.stopPropagation()}>
              <VoteButton
                icon={<Share className="h-7 w-7" />}
                label="Share"
                onClick={() => setIsShareDialogOpen(true)}
              />
            </div>

            <button 
              className="bg-black/40 backdrop-blur-sm p-3 rounded-full hover:bg-streamixy-primary/30 transition-all"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-7 w-7 text-white" />
              <span className="text-[8px] text-white/70 mt-0.5">Search</span>
            </button>
            
            <VoteButton
              icon={<MessageSquare className="h-7 w-7" />}
              label="Request"
              onClick={() => {
                if (requestStatus === "idle") {
                  handleRequest();
                }
              }}
            />
            
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
          </div>
        </div>
      </div>

      {/* Comment Dialog */}
      <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
        <DialogContent onClick={stopAllPropagation} className="dialog-content bg-black/90 border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Add Comment</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Leave a comment on {creator.name}'s stream
            </p>
            <div className="flex space-x-2 items-center">
              <Input 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Type your comment..." 
                className="flex-1 bg-white/10 border-white/20 text-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleComment();
                  }
                }}
              />
              <Button 
                onClick={handleComment}
                className="bg-streamixy-primary hover:bg-streamixy-primary/80"
              >
                Send
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
                  <span>{option.name}</span>
                </div>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

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

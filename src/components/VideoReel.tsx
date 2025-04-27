import React, { useState, useRef, useEffect } from "react";
import { Play, Gift, Share, Vote, MessageSquare, Search, MessagesSquare } from "lucide-react";
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
    toast({
      title: "Tokens Sent!",
      description: `You voted ${amount} SYX tokens to ${creator.name}`,
    });
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
          className="absolute right-4 bottom-1/3 flex flex-col space-y-4"
          onClick={stopAllPropagation}
        >
          <div onClick={() => setIsSearchOpen(true)}>
            <VoteButton
              icon={<Search className="h-6 w-6" />}
              label="Search"
            />
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <div onClick={stopAllPropagation}>
                <VoteButton
                  icon={<Vote className="h-6 w-6" />}
                  label="Vote"
                />
              </div>
            </DialogTrigger>
            <DialogContent onClick={stopAllPropagation} className="dialog-content">
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
                    id="custom-amount"
                  />
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
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
          
          <Dialog>
            <DialogTrigger asChild>
              <div onClick={stopAllPropagation}>
                <VoteButton
                  icon={<Gift className="h-6 w-6" />}
                  label="Gift"
                />
              </div>
            </DialogTrigger>
            <DialogContent onClick={stopAllPropagation} className="dialog-content">
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
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <div onClick={stopAllPropagation}>
                <VoteButton
                  icon={<Share className="h-6 w-6" />}
                  label="Share"
                />
              </div>
            </DialogTrigger>
            <DialogContent onClick={stopAllPropagation} className="dialog-content">
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
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <div onClick={stopAllPropagation}>
                <VoteButton
                  icon={<MessageSquare className="h-6 w-6" />}
                  label="Comment"
                />
              </div>
            </DialogTrigger>
            <DialogContent onClick={stopAllPropagation} className="dialog-content">
              <DialogHeader>
                <DialogTitle>Add Comment</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col space-y-4 py-4">
                <Textarea 
                  placeholder="Type your comment here..."
                  className="min-h-[100px]"
                  id="comment-input"
                />
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleComment((document.getElementById('comment-input') as HTMLTextAreaElement).value);
                    (document.getElementById('comment-input') as HTMLTextAreaElement).value = '';
                  }}
                  className="bg-streamixy-primary hover:bg-streamixy-primary/80"
                >
                  Post Comment
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <div onClick={stopAllPropagation}>
                <VoteButton
                  icon={<MessagesSquare className="h-6 w-6" />}
                  label="Request"
                />
              </div>
            </DialogTrigger>
            <DialogContent onClick={stopAllPropagation} className="dialog-content">
              <DialogHeader>
                <DialogTitle>Send Request</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col space-y-4 py-4">
                <Textarea 
                  placeholder="Type your request here..."
                  className="min-h-[100px]"
                  id="request-input"
                />
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toast({
                      title: "Request Sent",
                      description: "Your request has been sent to the creator",
                    });
                  }}
                  className="bg-streamixy-primary hover:bg-streamixy-primary/80"
                >
                  Send Request
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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

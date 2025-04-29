
import React, { useState, useRef, useEffect } from "react";
import { 
  Camera, 
  Share, 
  MessageSquare, 
  Users, 
  Play,
  Volume2,
  VolumeX,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import LiveFilter from "@/components/LiveFilter";
import LiveComment from "@/components/LiveComment";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const GoLive = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLive, setIsLive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<{ id: number; text: string; username: string; }[]>([]);
  const [commentCounter, setCommentCounter] = useState(0);
  const [receivedGifts, setReceivedGifts] = useState<{ id: number; emoji: string; }[]>([]);
  const [giftCounter, setGiftCounter] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);
  const [joinRequests, setJoinRequests] = useState<{
    id: number;
    username: string;
    message: string;
    status: "pending" | "accepted" | "rejected";
  }[]>([]);
  const [requestCounter, setRequestCounter] = useState(0);
  const { toast } = useToast();
  
  const mockUser = {
    name: "JaneDoe",
    avatar: "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
  };

  useEffect(() => {
    startCamera();

    const viewerInterval = setInterval(() => {
      if (isLive) {
        setViewerCount(prev => Math.min(prev + Math.floor(Math.random() * 5), 999));
      }
    }, 5000);
    
    const commentInterval = setInterval(() => {
      if (isLive && Math.random() > 0.6) {
        const randomComments = [
          { username: "alex88", text: "Love your content!" },
          { username: "sarah_j", text: "Hi from NYC!" },
          { username: "tech_guy", text: "What camera are you using?" },
          { username: "travel_lover", text: "Where are you?" },
          { username: "music_fan", text: "The lighting is perfect!" },
        ];
        
        const randomComment = randomComments[Math.floor(Math.random() * randomComments.length)];
        addComment(randomComment.text, randomComment.username);
      }
    }, 3000);

    const giftInterval = setInterval(() => {
      if (isLive && Math.random() > 0.8) {
        const giftItems = ["🌹", "🦁", "👑", "💎"];
        const randomGift = giftItems[Math.floor(Math.random() * giftItems.length)];
        const giftValues = {"🌹": 5, "🦁": 50, "👑": 100, "💎": 500};
        const giftValue = giftValues[randomGift as keyof typeof giftValues];
        
        addGift(randomGift);
        setTotalTokens(prev => prev + giftValue);
      }
    }, 5000);

    // Simulate join requests
    const requestInterval = setInterval(() => {
      if (isLive && Math.random() > 0.9) {
        const randomUsers = [
          { username: "FanUser1", message: "Can I join your stream?" },
          { username: "MusicLover", message: "Let me show you something!" },
          { username: "GamingFan", message: "I'd like to join if possible" },
          { username: "ArtistViewer", message: "Would love to collaborate!" },
        ];
        
        const randomUser = randomUsers[Math.floor(Math.random() * randomUsers.length)];
        handleJoinRequest(randomUser);
      }
    }, 15000);

    return () => {
      stopCamera();
      clearInterval(viewerInterval);
      clearInterval(commentInterval);
      clearInterval(giftInterval);
      clearInterval(requestInterval);
    };
  }, [isLive]);

  useEffect(() => {
    if (isLive && videoRef.current && canvasRef.current && activeFilter) {
      const interval = setInterval(() => {
        applyFilterToVideo();
      }, 33);
      
      return () => clearInterval(interval);
    }
  }, [activeFilter, isLive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: !isMuted
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Error",
        description: "Could not access your camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const toggleLive = () => {
    if (isLive) {
      setIsLive(false);
      setViewerCount(0);
      setTotalTokens(0);
      setComments([]);
      setReceivedGifts([]);
      toast({
        title: "Stream Ended",
        description: "Your live stream has ended"
      });
    } else {
      setIsLive(true);
      toast({
        title: "Stream Started",
        description: "You're now live! People can join your stream."
      });
    }
  };

  const toggleMute = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const applyFilterToVideo = () => {
    if (!canvasRef.current || !videoRef.current) return;
    
    const context = canvasRef.current.getContext('2d');
    if (!context) return;
    
    context.drawImage(
      videoRef.current, 
      0, 0, 
      canvasRef.current.width, 
      canvasRef.current.height
    );
    
    const imageData = context.getImageData(
      0, 0, 
      canvasRef.current.width, 
      canvasRef.current.height
    );
    
    switch (activeFilter) {
      case 'grayscale':
        applyGrayscale(imageData.data);
        break;
      case 'sepia':
        applySepia(imageData.data);
        break;
      case 'invert':
        applyInvert(imageData.data);
        break;
      case 'blur':
        // Blur is applied using CSS filter
        break;
      case 'brightness':
        applyBrightness(imageData.data, 1.3);
        break;
      default:
        // No filter
        break;
    }
    
    context.putImageData(imageData, 0, 0);
  };

  const applyGrayscale = (data: Uint8ClampedArray) => {
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg;     // red
      data[i + 1] = avg; // green
      data[i + 2] = avg; // blue
    }
  };
  
  const applySepia = (data: Uint8ClampedArray) => {
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
      data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
      data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
    }
  };
  
  const applyInvert = (data: Uint8ClampedArray) => {
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];         // red
      data[i + 1] = 255 - data[i + 1]; // green
      data[i + 2] = 255 - data[i + 2]; // blue
    }
  };
  
  const applyBrightness = (data: Uint8ClampedArray, factor: number) => {
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * factor);         // red
      data[i + 1] = Math.min(255, data[i + 1] * factor); // green
      data[i + 2] = Math.min(255, data[i + 2] * factor); // blue
    }
  };

  const addComment = (text: string, username: string = mockUser.name) => {
    const newComment = {
      id: commentCounter,
      text,
      username
    };
    
    setComments(prev => [...prev, newComment]);
    setCommentCounter(prev => prev + 1);
    
    // Show notification for comments from others
    if (username !== mockUser.name) {
      toast({
        title: "New Comment",
        description: `${username}: ${text}`
      });
    }
    
    // Remove the comment after a timeout
    setTimeout(() => {
      setComments(prev => prev.filter(comment => comment.id !== newComment.id));
    }, 5000);
  };

  const addGift = (emoji: string) => {
    const newGift = {
      id: giftCounter,
      emoji
    };
    
    setReceivedGifts(prev => [...prev, newGift]);
    setGiftCounter(prev => prev + 1);
    
    setTimeout(() => {
      setReceivedGifts(prev => prev.filter(gift => gift.id !== newGift.id));
    }, 3000);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      addComment(comment);
      setComment("");
    }
  };

  const handleJoinRequest = (request: { username: string; message: string }) => {
    const newRequest = {
      id: requestCounter,
      username: request.username,
      message: request.message,
      status: "pending" as const
    };
    
    setJoinRequests(prev => [...prev, newRequest]);
    setRequestCounter(prev => prev + 1);
    
    toast({
      title: "Join Request",
      description: `${request.username} wants to join your stream: "${request.message}"`
    });
    
    return newRequest.id;
  };

  const handleJoinRequestResponse = (requestId: number, accepted: boolean) => {
    setJoinRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, status: accepted ? "accepted" : "rejected" } 
          : request
      )
    );
    
    const request = joinRequests.find(req => req.id === requestId);
    if (request) {
      toast({
        title: accepted ? "Request Accepted" : "Request Rejected",
        description: `You ${accepted ? 'accepted' : 'rejected'} ${request.username}'s request to join`
      });
    }
  };

  const handleShare = () => {
    toast({
      title: "Share",
      description: "Sharing options opened"
    });
  };

  const filters = [
    { id: 'normal', name: 'Normal', class: '' },
    { id: 'grayscale', name: 'Grayscale', class: 'grayscale' },
    { id: 'sepia', name: 'Sepia', class: 'sepia' },
    { id: 'invert', name: 'Invert', class: 'invert' },
    { id: 'blur', name: 'Blur', class: 'blur-sm' },
    { id: 'brightness', name: 'Bright', class: 'brightness-125' }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative w-full h-screen overflow-hidden">
        <video 
          ref={videoRef}
          autoPlay 
          playsInline
          muted={isMuted}
          className={`absolute inset-0 h-full w-full object-cover ${!activeFilter || activeFilter === 'normal' ? '' : filters.find(f => f.id === activeFilter)?.class || ''}`}
        />
        
        <canvas 
          ref={canvasRef} 
          width="640" 
          height="480" 
          className={`absolute inset-0 h-full w-full object-cover ${activeFilter && activeFilter !== 'blur' ? 'block' : 'hidden'}`}
        />
        
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="absolute left-0 top-20 right-0 bottom-20 overflow-hidden pointer-events-none">
          {comments.map((comment) => (
            <LiveComment 
              key={comment.id} 
              username={comment.username} 
              text={comment.text} 
            />
          ))}
        </div>

        <div className="absolute right-20 top-20 bottom-20 overflow-hidden pointer-events-none flex flex-col items-end">
          {receivedGifts.map((gift) => (
            <div 
              key={gift.id} 
              className="text-4xl animate-gift mb-4"
            >
              {gift.emoji}
            </div>
          ))}
        </div>
        
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 border-2 border-streamixy-primary">
              <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
              <AvatarFallback>{mockUser.name[0]}</AvatarFallback>
            </Avatar>
            <span className="ml-2 font-semibold">{mockUser.name}</span>
            {isLive && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
                <span className="h-1.5 w-1.5 bg-white rounded-full mr-1"></span>
                LIVE
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span className="text-sm">{viewerCount}</span>
            </div>
            
            {isLive && (
              <div className="flex items-center bg-black/40 backdrop-blur-sm py-1 px-2 rounded-full">
                <span className="text-streamixy-primary text-xs font-bold mr-1">SYX:</span>
                <span className="text-sm">{totalTokens}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Join Requests Notifications */}
        {isLive && joinRequests.some(req => req.status === "pending") && (
          <div className="absolute top-16 right-0 p-4">
            {joinRequests
              .filter(req => req.status === "pending")
              .map(request => (
                <div 
                  key={request.id}
                  className="bg-black/80 backdrop-blur-sm p-3 rounded-lg mb-2 border border-streamixy-primary/50"
                >
                  <div className="flex items-center mb-2">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarFallback>{request.username[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold">{request.username}</span>
                  </div>
                  <p className="text-sm mb-2">{request.message}</p>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="default"
                      className="bg-streamixy-primary hover:bg-streamixy-primary/80"
                      onClick={() => handleJoinRequestResponse(request.id, true)}
                    >
                      Accept
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="bg-transparent border-white/20"
                      onClick={() => handleJoinRequestResponse(request.id, false)}
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        )}
        
        <div className="absolute bottom-20 left-0 right-0 overflow-x-auto hide-scrollbar pb-2">
          <div className="flex space-x-2 px-4">
            {filters.map(filter => (
              <LiveFilter 
                key={filter.id} 
                name={filter.name} 
                isActive={activeFilter === filter.id}
                onClick={() => setActiveFilter(filter.id)}
              />
            ))}
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          {isLive ? (
            <div className="flex flex-col space-y-4">
              <form onSubmit={handleSubmitComment} className="flex space-x-2">
                <Input 
                  type="text" 
                  className="flex-1 bg-white/20 border-0 text-white placeholder:text-white/70"
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <Button type="submit" variant="ghost" size="icon">
                  <MessageSquare className="h-5 w-5" />
                </Button>
                <Button type="button" variant="ghost" size="icon" onClick={handleShare}>
                  <Share className="h-5 w-5" />
                </Button>
              </form>
              
              <div className="flex justify-between">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleMute}
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                
                <Button 
                  variant="default" 
                  className="bg-red-500 hover:bg-red-600"
                  onClick={toggleLive}
                >
                  End Stream
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setActiveFilter(activeFilter === null ? 'normal' : null)}
                >
                  <Filter className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <Button 
                className="bg-streamixy-primary hover:bg-streamixy-primary/80 px-8"
                onClick={toggleLive}
              >
                <Play className="mr-2 h-5 w-5" />
                Go Live
              </Button>
            </div>
          )}
        </div>
      </div>

      <style>
        {`
        @keyframes gift-animation {
          0% {
            transform: translateX(100px);
            opacity: 0;
          }
          10% {
            transform: translateX(0);
            opacity: 1;
          }
          90% {
            transform: translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateX(-20px);
            opacity: 0;
          }
        }
        
        .animate-gift {
          animation: gift-animation 3s ease-out forwards;
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        `}
      </style>
    </div>
  );
};

export default GoLive;

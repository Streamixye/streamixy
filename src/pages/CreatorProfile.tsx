import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Coins, Download, Share } from "lucide-react";

interface NFT {
  id: string;
  name: string;
  image: string;
  price: number;
  previousPrice: number;
  marketCap: number;
  previousMarketCap: number;
  roi: number;
  previousRoi: number;
  stakedAmount: number;
  pnl: number;
}

interface Stream {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  views: number;
  date: string;
}

const CreatorProfile = () => {
  const { username } = useParams();
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [stakeAmount, setStakeAmount] = useState("");
  const [stakeModalOpen, setStakeModalOpen] = useState(false);
  const [selectedNft, setSelectedNft] = useState<NFT | null>(null);
  const [showShareMenu, setShowShareMenu] = useState<string | null>(null);

  // Mock data - in a real app, this would come from an API
  const creator = {
    name: "CryptoCreator",
    username: "crypto_creator",
    avatar: "https://i.pravatar.cc/150?img=1",
    followers: 24500,
    nfts: [
      {
        id: "1",
        name: "Streamixy Genesis",
        image: "https://source.unsplash.com/featured/400x400?art",
        price: 1000,
        previousPrice: 950,
        marketCap: 45000,
        previousMarketCap: 44000,
        roi: 12,
        previousRoi: 10,
        stakedAmount: 0,
        pnl: 0,
      }
    ],
    pastStreams: [
      {
        id: "1",
        title: "Building a Web3 Metaverse in Real-Time",
        thumbnail: "https://source.unsplash.com/featured/400x225?gaming",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
        views: 1254,
        date: "2024-04-26",
      },
      {
        id: "2",
        title: "NFT Drops Explained: Creating Value",
        thumbnail: "https://source.unsplash.com/featured/400x225?crypto",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
        views: 987,
        date: "2024-04-22",
      }
    ],
  };

  useEffect(() => {
    // Simulate price changes
    const interval = setInterval(() => {
      creator.nfts.forEach(nft => {
        const priceChange = (Math.random() * 10) - 5;
        nft.previousPrice = nft.price;
        nft.price = Math.max(10, nft.price + priceChange);
        
        const capChange = Math.random() < 0.5 ? -1 : 1;
        nft.previousMarketCap = nft.marketCap;
        nft.marketCap = nft.marketCap + (capChange * Math.random() * 1000);
        
        const roiChange = (Math.random() * 3) - 1;
        nft.previousRoi = nft.roi;
        nft.roi = nft.roi + roiChange;
        
        if (nft.stakedAmount > 0) {
          nft.pnl = nft.stakedAmount * ((nft.price - nft.previousPrice) / nft.previousPrice);
        }
        
        // Force component re-render to show animation changes
        setIsFollowing(prev => prev);
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: isFollowing 
        ? `You have unfollowed ${creator.name}` 
        : `You are now following ${creator.name}`,
    });
  };

  const handleStakeModalOpen = (nft: NFT) => {
    setSelectedNft(nft);
    setStakeModalOpen(true);
  };
  
  const handleStake = () => {
    if (!selectedNft || !stakeAmount || parseFloat(stakeAmount) <= 0) return;
    
    const amount = parseFloat(stakeAmount);
    
    // Update the NFT's staked amount
    creator.nfts.forEach(nft => {
      if (nft.id === selectedNft.id) {
        nft.stakedAmount = (nft.stakedAmount || 0) + amount;
      }
    });
    
    toast({
      title: "Staking Successful",
      description: `You've staked ${amount} SYX tokens on ${selectedNft.name}`,
    });
    
    setStakeAmount("");
    setStakeModalOpen(false);
    setSelectedNft(null);
  };

  const handleWithdraw = (nft: NFT) => {
    if (nft.stakedAmount <= 0) return;
    
    toast({
      title: "Withdrawal Successful",
      description: `You've withdrawn ${nft.stakedAmount.toFixed(2)} SYX tokens from ${nft.name}`,
    });
    
    nft.stakedAmount = 0;
    nft.pnl = 0;
    
    // Force re-render
    setIsFollowing(prev => prev);
  };

  const handleShareStream = (stream: Stream, platform: string) => {
    // Create share URLs based on platform
    let shareUrl = "";
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this stream: ${stream.title}`);
    
    switch(platform) {
      case "WhatsApp":
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
      case "Facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
        break;
      case "Twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case "Telegram":
        shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
        break;
      default:
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
    }
    
    // Open in new window
    window.open(shareUrl, "_blank");
    
    toast({
      title: "Shared Successfully",
      description: `Shared "${stream.title}" to ${platform}`,
    });
    setShowShareMenu(null);
  };

  const handleDownload = (stream: Stream) => {
    toast({
      title: "Download Started",
      description: `Downloading "${stream.title}"`,
    });
    
    // Create an anchor element and trigger download
    const a = document.createElement('a');
    a.href = stream.videoUrl;
    a.download = `${stream.title.replace(/\s+/g, '_')}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-20">
      {/* Profile Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Avatar className="h-20 w-20">
          <AvatarImage src={creator.avatar} alt={creator.name} />
          <AvatarFallback>{creator.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{creator.name}</h1>
          <p className="text-white/70">@{creator.username}</p>
          <p className="text-white/70">{creator.followers.toLocaleString()} followers</p>
        </div>
        <Button
          onClick={handleFollow}
          className={isFollowing ? "bg-white/10" : "bg-streamixy-primary"}
        >
          {isFollowing ? "Following" : "Follow"}
        </Button>
      </div>

      {/* NFTs Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">NFTs</h2>
        <div className="grid grid-cols-1 gap-4">
          {creator.nfts.map((nft) => (
            <Card key={nft.id} className="bg-black/50 border border-white/10">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span className="text-white">{nft.name}</span>
                  <Badge className={nft.price > nft.previousPrice ? "bg-green-500" : "bg-red-500"}>
                    {nft.price > nft.previousPrice ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {Math.abs(((nft.price - nft.previousPrice) / nft.previousPrice) * 100).toFixed(2)}%
                  </Badge>
                </CardTitle>
                <div className="text-sm text-white/70">Creator: {creator.name}</div>
              </CardHeader>
              <CardContent>
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                
                {/* NFT Stats Section */}
                <div className="grid grid-cols-3 gap-2 text-sm mb-4">
                  <div className="p-2 rounded bg-black/40">
                    <div className="text-white">Price</div>
                    <div className={`font-bold ${nft.price > nft.previousPrice ? 'text-green-500 animate-pulse' : 'text-red-500 animate-pulse'}`}>
                      {nft.price.toFixed(2)} SYX
                    </div>
                  </div>
                  
                  <div className="p-2 rounded bg-black/40">
                    <div className="text-white">Market Cap</div>
                    <div className={`font-bold ${nft.marketCap > nft.previousMarketCap ? 'text-green-500 animate-pulse' : 'text-red-500 animate-pulse'}`}>
                      {nft.marketCap.toLocaleString()} SYX
                    </div>
                  </div>
                  
                  <div className="p-2 rounded bg-black/40">
                    <div className="text-white">ROI</div>
                    <div className={`font-bold ${nft.roi > nft.previousRoi ? 'text-green-500 animate-pulse' : 'text-red-500 animate-pulse'}`}>
                      {nft.roi > 0 ? '+' : ''}{nft.roi.toFixed(2)}%
                    </div>
                  </div>
                </div>
                
                {/* Staking Section */}
                {nft.stakedAmount > 0 ? (
                  <div className="mt-2 p-3 rounded bg-streamixy-primary/10">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white">Your Stake:</span>
                      <span className="font-bold text-white">{nft.stakedAmount.toFixed(2)} SYX</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white">P&L:</span>
                      <span className={`font-bold ${nft.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {nft.pnl >= 0 ? '+' : ''}{nft.pnl.toFixed(4)} SYX
                      </span>
                    </div>
                    <Progress 
                      className="mt-2" 
                      value={50 + (nft.pnl / nft.stakedAmount * 500)} 
                    />
                    <Button 
                      onClick={() => handleWithdraw(nft)}
                      className="w-full mt-3 bg-streamixy-primary hover:bg-streamixy-primary/80"
                    >
                      Withdraw Stake
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleStakeModalOpen(nft)}
                    className="w-full bg-streamixy-primary hover:bg-streamixy-primary/80"
                  >
                    <Coins className="h-4 w-4 mr-2" />
                    Stake SYX
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Past Streams */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Past Streams</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {creator.pastStreams.map((stream) => (
            <Card key={stream.id} className="bg-black/50 border border-white/10">
              <CardContent className="p-4">
                <div className="relative">
                  <img
                    src={stream.thumbnail}
                    alt={stream.title}
                    className="w-full h-40 object-cover rounded-md mb-2"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-streamixy-primary/80 rounded-full flex items-center justify-center cursor-pointer"
                         onClick={() => window.open(stream.videoUrl, "_blank")}>
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold mb-1">{stream.title}</h3>
                <p className="text-sm text-white/70 mb-2">
                  {stream.views.toLocaleString()} views · {stream.date}
                </p>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-white/20"
                    onClick={() => handleDownload(stream)}
                  >
                    <Download className="h-4 w-4 mr-1" /> Download
                  </Button>
                  <div className="relative">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 border-white/20"
                      onClick={() => setShowShareMenu(showShareMenu === stream.id ? null : stream.id)}
                    >
                      <Share className="h-4 w-4 mr-1" /> Share
                    </Button>
                    {showShareMenu === stream.id && (
                      <div className="absolute z-10 right-0 mt-1 w-40 bg-black border border-white/10 rounded-md shadow-lg overflow-hidden">
                        <div 
                          className="p-2 hover:bg-white/10 cursor-pointer"
                          onClick={() => handleShareStream(stream, "WhatsApp")}
                        >
                          WhatsApp
                        </div>
                        <div 
                          className="p-2 hover:bg-white/10 cursor-pointer"
                          onClick={() => handleShareStream(stream, "Facebook")}
                        >
                          Facebook
                        </div>
                        <div 
                          className="p-2 hover:bg-white/10 cursor-pointer"
                          onClick={() => handleShareStream(stream, "Twitter")}
                        >
                          Twitter
                        </div>
                        <div 
                          className="p-2 hover:bg-white/10 cursor-pointer"
                          onClick={() => handleShareStream(stream, "Telegram")}
                        >
                          Telegram
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Staking Modal */}
      {stakeModalOpen && selectedNft && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <Card className="bg-black border border-white/10 w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-white">Stake SYX on {selectedNft.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-white mb-1 block">NFT Price</label>
                <p className="text-xl font-bold text-white">{selectedNft.price.toFixed(2)} <span className="text-streamixy-primary">SYX</span></p>
              </div>
              
              <div>
                <label className="text-sm text-white mb-1 block">Amount to Stake</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="bg-transparent border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              
              <div className="mt-2 p-3 rounded-md bg-streamixy-primary/10 text-sm">
                <p className="text-white">
                  Staking SYX on this NFT will give you exposure to its price movements. Your P&L will change based on the NFT's performance.
                </p>
              </div>
            </CardContent>
            <div className="flex gap-2 p-6 pt-0">
              <Button 
                variant="outline" 
                className="w-1/2 border-white/20" 
                onClick={() => {
                  setStakeModalOpen(false);
                  setSelectedNft(null);
                  setStakeAmount("");
                }}
              >
                Cancel
              </Button>
              <Button 
                className="w-1/2 bg-streamixy-primary hover:bg-streamixy-primary/80"
                onClick={handleStake}
                disabled={!stakeAmount || parseFloat(stakeAmount) <= 0}
              >
                Confirm Stake
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CreatorProfile;

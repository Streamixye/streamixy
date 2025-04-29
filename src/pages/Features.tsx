import React from "react";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Gift,
  Video,
  Music,
  TrendingUp,
  Image as ImageIcon,
  Share,
  BadgeDollarSign,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Features = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/dashboard");
  };
  
  return (
    <div className="min-h-screen bg-black text-white p-2 sm:p-4 pb-20">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white" 
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold text-white ml-2">Features</h1>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="bg-black border border-white/10">
          <CardHeader>
            <Video className="h-5 w-5 text-streamixy-primary mb-2" />
            <CardTitle className="text-white">Live Streaming</CardTitle>
            <CardDescription className="text-white/70">
              Stream your content to your audience in real-time
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-white/80">
            High-quality, low-latency streaming with interactive features
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full bg-black border-white/20 text-white hover:bg-black/80"
              onClick={() => navigate("/go-live")}
            >
              Go Live
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="bg-black border border-white/10">
          <CardHeader>
            <ImageIcon className="h-5 w-5 text-streamixy-primary mb-2" />
            <CardTitle className="text-white">NFT Creation</CardTitle>
            <CardDescription className="text-white/70">
              Create NFTs from your content
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-white/80">
            Turn your digital content into unique, tradeable NFTs
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full bg-black border-white/20 text-white hover:bg-black/80"
              onClick={() => navigate("/nfts")}
            >
              Create NFT
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="bg-black border border-white/10">
          <CardHeader>
            <TrendingUp className="h-5 w-5 text-streamixy-primary mb-2" />
            <CardTitle className="text-white">Staking</CardTitle>
            <CardDescription className="text-white/70">
              Stake tokens to earn rewards
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-white/80">
            Earn passive income by staking your SYX tokens
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full bg-black border-white/20 text-white hover:bg-black/80"
              onClick={() => navigate("/stake")}
            >
              Stake Tokens
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="bg-black border border-white/10">
          <CardHeader>
            <Gift className="h-5 w-5 text-streamixy-primary mb-2" />
            <CardTitle className="text-white">Gifts</CardTitle>
            <CardDescription className="text-white/70">
              Send and receive virtual gifts
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-white/80">
            Show appreciation to creators with virtual gifts
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full bg-black border-white/20 text-white hover:bg-black/80"
              onClick={() => navigate("/")}
            >
              Explore
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="bg-black border border-white/10">
          <CardHeader>
            <Share className="h-5 w-5 text-streamixy-primary mb-2" />
            <CardTitle className="text-white">Referrals</CardTitle>
            <CardDescription className="text-white/70">
              Invite friends and earn rewards
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-white/80">
            Share your referral link and earn SYX tokens for each new user
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full bg-black border-white/20 text-white hover:bg-black/80"
              onClick={() => navigate("/dashboard")}
            >
              Get Referral Link
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="bg-black border border-white/10">
          <CardHeader>
            <BadgeDollarSign className="h-5 w-5 text-streamixy-primary mb-2" />
            <CardTitle className="text-white">Token Economy</CardTitle>
            <CardDescription className="text-white/70">
              SYX token ecosystem
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-white/80">
            Use SYX tokens for transactions, staking, and rewards
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full bg-black border-white/20 text-white hover:bg-black/80"
              onClick={() => navigate("/leaderboard")}
            >
              View Leaderboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Features;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Coins } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface NFT {
  id: number;
  name: string;
  creator: string;
  price: number;
  previousPrice: number;
  image: string;
  marketCap: number;
  previousMarketCap: number;
  roi: number;
  previousRoi: number;
  staked: number;
  pnl: number;
}

const NFTDetail = () => {
  const { id } = useParams();
  const [nft, setNft] = useState<NFT | null>(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [showStakeModal, setShowStakeModal] = useState(false);

  useEffect(() => {
    // Simulated NFT data fetch based on ID
    const nftImages = [
      "https://source.unsplash.com/photo-1518770660439-4636190af475",
      "https://source.unsplash.com/photo-1488590528505-98d2b5aba04b",
      "https://source.unsplash.com/photo-1582562124811-c09040d0a901",
      "https://source.unsplash.com/photo-1535268647677-300dbf3d78d1"
    ];
    
    const mockNft = {
      id: parseInt(id || "1"),
      name: id === "2" ? "Digital Dreamscape" : id === "3" ? "Virtual Reality" : id === "4" ? "Metaverse Token" : "Streamixy Genesis",
      creator: id === "2" ? "NFTMaster" : id === "3" ? "VRCreator" : id === "4" ? "MetaDesigner" : "CryptoArtist",
      price: 230,
      previousPrice: 220,
      image: nftImages[parseInt(id || "1") - 1] || nftImages[0],
      marketCap: 45000,
      previousMarketCap: 44000,
      roi: 12,
      previousRoi: 10,
      staked: 0,
      pnl: 0
    };
    setNft(mockNft);
  }, [id]);

  useEffect(() => {
    if (!nft) return;
    
    const interval = setInterval(() => {
      setNft(prevNft => {
        if (!prevNft) return null;
        
        const priceChange = Math.random() * 5; // Only positive price changes
        const previousPrice = prevNft.price;
        const newPrice = prevNft.price + priceChange;
        
        const roiChange = Math.random() * 2; // Only positive ROI changes
        const previousRoi = prevNft.roi;
        const newRoi = prevNft.roi + roiChange;
        
        const capChange = 1; // Always positive
        const previousMarketCap = prevNft.marketCap;
        const newMarketCap = prevNft.marketCap + (capChange * Math.random() * 1000);
        
        // Calculate PNL based on stake amount, ensuring it's always positive and starts from 0.02
        let pnl = prevNft.pnl;
        
        if (prevNft.staked > 0) {
          // If stake is large (>= 500), give higher profit rate
          if (prevNft.staked >= 500) {
            pnl = Math.max(prevNft.pnl + 0.9, 0.9); // Start at least from 0.9
          } else {
            // Regular stakes increase by 0.01, starting from minimum 0.02
            pnl = Math.max(prevNft.pnl + 0.01, 0.02);
          }
        }
        
        return {
          ...prevNft,
          previousPrice: previousPrice,
          price: newPrice,
          previousMarketCap: previousMarketCap,
          marketCap: newMarketCap,
          previousRoi: previousRoi,
          roi: newRoi,
          pnl: pnl
        };
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, [nft]);

  const handleStake = () => {
    if (!nft || !stakeAmount || parseFloat(stakeAmount) <= 0) return;
    
    const amount = parseFloat(stakeAmount);
    
    setNft(prev => {
      if (!prev) return null;
      
      // Set initial PNL based on stake amount
      let initialPnl = 0.02; // Default starting PNL
      
      if (amount >= 500) {
        initialPnl = 0.9; // Higher starting PNL for large stakes
      }
      
      return {
        ...prev,
        staked: prev.staked + amount,
        pnl: initialPnl // Start with the initial PNL value
      };
    });
    
    setStakeAmount("");
    setShowStakeModal(false);
  };

  const handleWithdraw = () => {
    if (!nft || nft.staked <= 0) return;
    
    setNft(prev => {
      if (!prev) return null;
      return {
        ...prev,
        staked: 0,
        pnl: 0
      };
    });
  };

  if (!nft) return <div className="min-h-screen bg-black text-white p-4 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-20">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{nft.name}</h1>
      </div>

      <Card className="bg-black border border-white/10 overflow-hidden">
        <div className="w-full h-64 bg-streamixy-dark/50 flex items-center justify-center relative overflow-hidden">
          <img 
            src={nft.image} 
            alt={nft.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="text-6xl font-bold text-white/70">{nft.name}</div>
          </div>
        </div>
        
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div>
              <div>{nft.name}</div>
              <div className="text-sm text-white mt-1">Creator: {nft.creator}</div>
            </div>
            <Badge className="bg-green-500">
              <TrendingUp className="h-3 w-3 mr-1" />
              {Math.abs(((nft.price - nft.previousPrice) / nft.previousPrice) * 100).toFixed(2)}%
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="p-2 rounded bg-black/40">
              <div className="text-white">Price</div>
              <div className="font-bold text-green-500 animate-pulse">
                {nft.price.toFixed(2)} SYX
              </div>
            </div>
            
            <div className="p-2 rounded bg-black/40">
              <div className="text-white">Market Cap</div>
              <div className="font-bold text-green-500 animate-pulse">
                {nft.marketCap.toLocaleString()} SYX
              </div>
              <div className="mt-1 h-1 bg-streamixy-primary/30 rounded-full overflow-hidden">
                <div className="h-full bg-streamixy-primary" style={{width: `${Math.min(100, Math.max(0, (nft.marketCap / 100000) * 100))}%`}}></div>
              </div>
            </div>
            
            <div className="p-2 rounded bg-black/40">
              <div className="text-white">ROI</div>
              <div className="font-bold text-green-500 animate-pulse">
                +{nft.roi.toFixed(2)}%
              </div>
            </div>
          </div>
          
          {nft.staked > 0 && (
            <div className="mt-2 p-3 rounded bg-streamixy-primary/10">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white">Your Stake:</span>
                <span className="font-bold text-white">{nft.staked.toFixed(2)} SYX</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white">P&L:</span>
                <span className="font-bold text-green-500">
                  +{nft.pnl.toFixed(4)} SYX
                </span>
              </div>
              <Progress 
                className="mt-2" 
                value={75} // Fixed at 75% to show positive progress
              />
              <Button 
                onClick={handleWithdraw}
                className="w-full mt-3 bg-streamixy-primary hover:bg-streamixy-primary/80"
              >
                Withdraw Stake
              </Button>
            </div>
          )}
        </CardContent>
        
        <CardFooter>
          <Button 
            onClick={() => setShowStakeModal(true)} 
            className="w-full bg-streamixy-primary hover:bg-streamixy-primary/80"
            disabled={nft.staked > 0}
          >
            <Coins className="h-4 w-4 mr-2" />
            Stake SYX
          </Button>
        </CardFooter>
      </Card>

      {showStakeModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <Card className="bg-black border border-white/10 w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-white">Stake SYX on {nft.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  Staking SYX on this NFT will give you exposure to its price movements. Staking 500+ SYX will increase your profit rate!
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button 
                variant="outline" 
                className="w-1/2 border-white/20 text-white" 
                onClick={() => {
                  setShowStakeModal(false);
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
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default NFTDetail;

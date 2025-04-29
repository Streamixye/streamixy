
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
  roi: number;
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
    const mockNft = {
      id: 1,
      name: "Streamixy Genesis",
      creator: "CryptoArtist",
      price: 230,
      previousPrice: 220,
      image: "",
      marketCap: 45000,
      roi: 12,
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
        
        const priceChange = (Math.random() * 10) - 5;
        const previousPrice = prevNft.price;
        const newPrice = Math.max(10, prevNft.price + priceChange);
        const roi = ((newPrice - previousPrice) / previousPrice) * 100;
        const capChange = Math.random() < 0.5 ? -1 : 1;
        const newMarketCap = prevNft.marketCap + (capChange * Math.random() * 1000);
        const pnl = prevNft.staked > 0 
          ? prevNft.staked * ((newPrice - previousPrice) / previousPrice) 
          : prevNft.pnl;
        
        return {
          ...prevNft,
          previousPrice: previousPrice,
          price: newPrice,
          marketCap: newMarketCap,
          roi: roi,
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
      return {
        ...prev,
        staked: prev.staked + amount
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

  if (!nft) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-20">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{nft.name}</h1>
      </div>

      <Card className="bg-black border border-white/10 overflow-hidden">
        <div className="w-full h-64 bg-streamixy-dark/50 flex items-center justify-center">
          <div className="text-6xl font-bold text-streamixy-primary/30">{nft.name}</div>
        </div>
        
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div>
              <div>{nft.name}</div>
              <div className="text-sm text-white mt-1">Creator: {nft.creator}</div>
            </div>
            <Badge className={nft.price > nft.previousPrice ? "bg-green-500" : "bg-red-500"}>
              {nft.price > nft.previousPrice ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {Math.abs(((nft.price - nft.previousPrice) / nft.previousPrice) * 100).toFixed(2)}%
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="p-2 rounded bg-black/40">
              <div className="text-white">Price</div>
              <div className={`font-bold text-white ${nft.price > nft.previousPrice ? 'text-green-500 animate-pulse' : 'text-red-500 animate-pulse'}`}>
                {nft.price.toFixed(2)} SYX
              </div>
            </div>
            
            <div className="p-2 rounded bg-black/40">
              <div className="text-white">Market Cap</div>
              <div className={`font-bold text-white ${nft.marketCap > (nft.marketCap - nft.marketCap * 0.01) ? 'text-green-500 animate-pulse' : 'text-red-500 animate-pulse'}`}>
                {nft.marketCap.toLocaleString()} SYX
              </div>
              <div className="mt-1 h-1 bg-streamixy-primary/30 rounded-full overflow-hidden">
                <div className="h-full bg-streamixy-primary" style={{width: `${Math.random() * 100}%`}}></div>
              </div>
            </div>
            
            <div className="p-2 rounded bg-black/40">
              <div className="text-white">ROI</div>
              <div className={`font-bold text-white ${nft.roi > 0 ? 'text-green-500 animate-pulse' : 'text-red-500 animate-pulse'}`}>
                {nft.roi > 0 ? '+' : ''}{nft.roi.toFixed(2)}%
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
                <span className={`font-bold ${nft.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {nft.pnl >= 0 ? '+' : ''}{nft.pnl.toFixed(4)} SYX
                </span>
              </div>
              <Progress 
                className="mt-2" 
                value={50 + (nft.pnl / nft.staked * 500)} 
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
                  Staking SYX on this NFT will give you exposure to its price movements. Your P&L will change based on the NFT's performance.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button 
                variant="outline" 
                className="w-1/2 border-white/20" 
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

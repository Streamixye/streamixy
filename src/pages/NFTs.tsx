
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

const NFTs = () => {
  const [nfts, setNfts] = useState<NFT[]>([
    {
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
    },
    {
      id: 2,
      name: "Digital Dreamscape",
      creator: "NFTMaster",
      price: 180,
      previousPrice: 190,
      image: "",
      marketCap: 32000,
      roi: -5,
      staked: 0,
      pnl: 0
    },
    {
      id: 3,
      name: "Virtual Reality",
      creator: "VRCreator",
      price: 320,
      previousPrice: 300,
      image: "",
      marketCap: 64000,
      roi: 8,
      staked: 0,
      pnl: 0
    },
    {
      id: 4,
      name: "Metaverse Token",
      creator: "MetaDesigner",
      price: 450,
      previousPrice: 440,
      image: "",
      marketCap: 89000,
      roi: 15,
      staked: 0,
      pnl: 0
    }
  ]);
  const [selectedNft, setSelectedNft] = useState<NFT | null>(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [userBalance, setUserBalance] = useState(1000);
  const [stakeModalOpen, setStakeModalOpen] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setNfts(prevNfts => 
        prevNfts.map(nft => {
          const priceChange = (Math.random() * 10) - 5;
          const previousPrice = nft.price;
          const newPrice = Math.max(10, nft.price + priceChange);
          
          const roi = ((newPrice - previousPrice) / previousPrice) * 100;
          
          const capChange = Math.random() < 0.5 ? -1 : 1;
          const newMarketCap = nft.marketCap + (capChange * Math.random() * 1000);
          
          const pnl = nft.staked > 0 
            ? nft.staked * ((newPrice - previousPrice) / previousPrice) 
            : nft.pnl;
            
          return {
            ...nft,
            previousPrice: previousPrice,
            price: newPrice,
            marketCap: newMarketCap,
            roi: roi,
            pnl: pnl
          };
        })
      );
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleStakeModalOpen = (e: React.MouseEvent, nft: NFT) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedNft(nft);
    setStakeModalOpen(true);
  };
  
  const handleStake = () => {
    if (!selectedNft || !stakeAmount || parseFloat(stakeAmount) <= 0) return;
    
    const amount = parseFloat(stakeAmount);
    
    setNfts(prevNfts => 
      prevNfts.map(nft => 
        nft.id === selectedNft.id 
          ? {...nft, staked: nft.staked + amount} 
          : nft
      )
    );
    
    setStakeAmount("");
    setStakeModalOpen(false);
    setSelectedNft(null);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-20">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">NFTs Gallery</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nfts.map((nft) => (
          <Link to={`/nfts/${nft.id}`} key={nft.id}>
            <Card className="bg-black border border-white/10 overflow-hidden hover:border-streamixy-primary/50 transition-colors">
              <div className="w-full h-48 bg-streamixy-dark/50 flex items-center justify-center">
                <div className="text-4xl font-bold text-streamixy-primary/30">{nft.name}</div>
              </div>
              
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>{nft.name}</span>
                  <Badge className={nft.price > nft.previousPrice ? "bg-green-500" : "bg-red-500"}>
                    {nft.price > nft.previousPrice ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {Math.abs(((nft.price - nft.previousPrice) / nft.previousPrice) * 100).toFixed(2)}%
                  </Badge>
                </CardTitle>
                <div className="text-sm text-white">Creator: {nft.creator}</div>
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
                      <span>Your Stake:</span>
                      <span className="font-bold">{nft.staked.toFixed(2)} SYX</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>P&L:</span>
                      <span className={`font-bold ${nft.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {nft.pnl >= 0 ? '+' : ''}{nft.pnl.toFixed(4)} SYX
                      </span>
                    </div>
                    <Progress 
                      className="mt-2" 
                      value={50 + (nft.pnl / nft.staked * 500)} 
                    />
                  </div>
                )}
              </CardContent>
              
              <CardFooter>
                <Button 
                  onClick={(e) => handleStakeModalOpen(e, nft)} 
                  className="w-full bg-streamixy-primary hover:bg-streamixy-primary/80"
                >
                  <Coins className="h-4 w-4 mr-2" /> 
                  Stake SYX
                </Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
      
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
            <CardFooter className="flex gap-2">
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
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default NFTs;

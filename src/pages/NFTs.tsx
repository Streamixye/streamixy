
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
import { TrendingUp, Coins } from "lucide-react";
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
  description?: string;
}

const NFTs = () => {
  const [nfts, setNfts] = useState<NFT[]>([
    {
      id: 1,
      name: "Streamixy Genesis",
      creator: "CryptoArtist",
      price: 230,
      previousPrice: 220,
      image: "https://source.unsplash.com/photo-1518770660439-4636190af475",
      marketCap: 45000,
      previousMarketCap: 44000,
      roi: 12,
      previousRoi: 10,
      staked: 0,
      pnl: 0
    },
    {
      id: 2,
      name: "Digital Dreamscape",
      creator: "NFTMaster",
      price: 180,
      previousPrice: 190,
      image: "https://source.unsplash.com/photo-1488590528505-98d2b5aba04b",
      marketCap: 32000,
      previousMarketCap: 33000,
      roi: 5, // Changed to positive
      previousRoi: 3,
      staked: 0,
      pnl: 0
    },
    {
      id: 3,
      name: "Virtual Reality",
      creator: "VRCreator",
      price: 320,
      previousPrice: 300,
      image: "https://source.unsplash.com/photo-1582562124811-c09040d0a901",
      marketCap: 64000,
      previousMarketCap: 62000,
      roi: 8,
      previousRoi: 7,
      staked: 0,
      pnl: 0
    },
    {
      id: 4,
      name: "Metaverse Token",
      creator: "MetaDesigner",
      price: 450,
      previousPrice: 440,
      image: "https://source.unsplash.com/photo-1535268647677-300dbf3d78d1",
      marketCap: 89000,
      previousMarketCap: 88000,
      roi: 15,
      previousRoi: 13,
      staked: 0,
      pnl: 0
    }
  ]);
  const [selectedNft, setSelectedNft] = useState<NFT | null>(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [stakeModalOpen, setStakeModalOpen] = useState(false);
  
  // Load NFTs from localStorage on component mount
  useEffect(() => {
    try {
      const createdNFTs = JSON.parse(localStorage.getItem("createdNFTs") || "[]");
      if (createdNFTs.length > 0) {
        // Combine with existing NFTs but avoid duplicates
        setNfts(prevNfts => {
          const existingIds = new Set(prevNfts.map(nft => nft.id));
          const newNfts = createdNFTs.filter((nft: NFT) => !existingIds.has(nft.id));
          return [...prevNfts, ...newNfts];
        });
      }
    } catch (error) {
      console.error("Error loading NFTs from localStorage:", error);
    }
  }, []);
  
  // Listen for newly created NFTs
  useEffect(() => {
    const handleNftCreated = (event: CustomEvent) => {
      const newNft = event.detail.nft;
      setNfts(prevNfts => {
        // Check if NFT already exists to avoid duplicates
        if (!prevNfts.some(nft => nft.id === newNft.id)) {
          return [...prevNfts, newNft];
        }
        return prevNfts;
      });
    };
    
    document.addEventListener('nftCreated', handleNftCreated as EventListener);
    
    return () => {
      document.removeEventListener('nftCreated', handleNftCreated as EventListener);
    };
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setNfts(prevNfts => 
        prevNfts.map(nft => {
          const priceChange = Math.random() * 5; // Only positive changes
          const previousPrice = nft.price;
          const newPrice = nft.price + priceChange;
          
          const roiChange = Math.random() * 2; // Only positive ROI changes
          const previousRoi = nft.roi;
          const newRoi = nft.roi + roiChange;
          
          const capChange = 1; // Always positive
          const previousMarketCap = nft.marketCap;
          const newMarketCap = nft.marketCap + (capChange * Math.random() * 1000);
          
          // Calculate PNL, ensuring it's always positive and incremental
          let pnl = nft.pnl;
          
          if (nft.staked > 0) {
            // If stake is large (>= 500), give higher profit rate
            if (nft.staked >= 500) {
              pnl = Math.max(nft.pnl + 0.9, 0.9); // Start at least from 0.9
            } else {
              // Regular stakes increase by 0.01, starting from minimum 0.02
              pnl = Math.max(nft.pnl + 0.01, 0.02);
            }
          }
            
          return {
            ...nft,
            previousPrice: previousPrice,
            price: newPrice,
            previousMarketCap: previousMarketCap,
            marketCap: newMarketCap,
            previousRoi: previousRoi,
            roi: newRoi,
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
      prevNfts.map(nft => {
        if (nft.id === selectedNft.id) {
          // Set initial PNL based on stake amount
          let initialPnl = 0.02; // Default starting PNL
          
          if (amount >= 500) {
            initialPnl = 0.9; // Higher starting PNL for large stakes
          }
          
          return {
            ...nft, 
            staked: nft.staked + amount,
            pnl: initialPnl // Start with initial PNL
          };
        }
        return nft;
      })
    );
    
    // Save staked NFTs to localStorage
    localStorage.setItem("stakedNFTs", JSON.stringify(
      nfts.map(nft => nft.id === selectedNft.id 
        ? {...nft, staked: nft.staked + parseFloat(stakeAmount)} 
        : nft
      ).filter(nft => nft.staked > 0)
    ));
    
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
          <Link to={`/nfts/${nft.id}`} key={nft.id} className="block">
            <Card className="bg-black border border-white/10 overflow-hidden hover:border-streamixy-primary/50 transition-colors">
              <div className="w-full h-48 bg-streamixy-dark/50 flex items-center justify-center relative overflow-hidden">
                <img 
                  src={nft.image} 
                  alt={nft.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="text-4xl font-bold text-white/70">{nft.name}</div>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>{nft.name}</span>
                  <Badge className="bg-green-500">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {Math.abs(((nft.price - nft.previousPrice) / nft.previousPrice) * 100).toFixed(2)}%
                  </Badge>
                </CardTitle>
                <div className="text-sm text-white">Creator: {nft.creator}</div>
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
                  </div>
                )}
              </CardContent>
              
              <CardFooter>
                <Button 
                  onClick={(e) => handleStakeModalOpen(e, nft)} 
                  className="w-full bg-streamixy-primary hover:bg-streamixy-primary/80"
                  disabled={nft.staked > 0}
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
                  Staking SYX on this NFT will give you exposure to its price movements. Staking 500+ SYX will increase your profit rate!
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button 
                variant="outline" 
                className="w-1/2 border-white/20 text-white" 
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

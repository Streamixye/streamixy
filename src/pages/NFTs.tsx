import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { useLiveStreams } from "@/hooks/use-live-streams";
import { useToast } from "@/hooks/use-toast";
import { useTokens } from "@/hooks/use-tokens";

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

interface StreamMetrics {
  streamId: string;
  viewerCount: number;
  tokensEarned: number;
  creatorName: string;
  creatorUsername: string;
  duration: number;
  timestamp: string;
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
  const { liveStreams } = useLiveStreams();
  const { toast } = useToast();
  const { tokenBalance, handleNftStake } = useTokens();
  const navigate = useNavigate();
  
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
  
  // Load staked NFTs from localStorage and merge with the initial NFTs
  useEffect(() => {
    try {
      const stakedNFTs = JSON.parse(localStorage.getItem("stakedNFTs") || "[]");
      if (stakedNFTs.length > 0) {
        setNfts(prevNfts => {
          return prevNfts.map(nft => {
            const stakedNft = stakedNFTs.find((n: NFT) => n.id === nft.id);
            if (stakedNft) {
              return {
                ...nft,
                staked: stakedNft.staked,
                pnl: stakedNft.pnl
              };
            }
            return nft;
          });
        });
      }
    } catch (error) {
      console.error("Error loading staked NFTs:", error);
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
  
  // Load livestream metrics from localStorage
  useEffect(() => {
    try {
      const savedMetrics: StreamMetrics[] = JSON.parse(localStorage.getItem('streamMetrics') || '[]');
      
      // Update NFTs based on saved metrics
      if (savedMetrics.length > 0) {
        setNfts(prevNfts => {
          return prevNfts.map(nft => {
            // Find metrics for this creator
            const creatorMetrics = savedMetrics.filter(
              metric => metric.creatorName === nft.creator || nft.creator.includes(metric.creatorName)
            );
            
            if (creatorMetrics.length > 0) {
              // Calculate influence based on total viewers from metrics
              const totalViewers = creatorMetrics.reduce((sum, metric) => sum + metric.viewerCount, 0);
              const viewerInfluence = Math.min(totalViewers / 100, 0.25); // Cap at 25% increase
              
              // Apply influence to price
              const newPrice = nft.price * (1 + viewerInfluence);
              
              // Update PNL based on viewer count if NFT is staked
              let newPnl = nft.pnl;
              if (nft.staked > 0) {
                // Higher viewer count = higher PNL
                newPnl = Math.max(nft.pnl + (viewerInfluence * 0.05), 0.02);
              }
              
              return {
                ...nft,
                previousPrice: nft.price,
                price: newPrice,
                pnl: newPnl
              };
            }
            return nft;
          });
        });
      }
    } catch (error) {
      console.error("Error loading stream metrics:", error);
    }
  }, []);
  
  // Listen for stream metrics updates
  useEffect(() => {
    const handleStreamEnded = (event: CustomEvent) => {
      const { streamId, viewerCount, tokensEarned, creatorName, creatorUsername } = event.detail;
      
      // Update NFTs related to this creator
      setNfts(prevNfts => {
        return prevNfts.map(nft => {
          // Check if this NFT belongs to the creator who ended the stream
          if (nft.creator === creatorName || nft.creator.includes(creatorName)) {
            // Calculate price increase based on viewer count (more viewers = higher increase)
            const viewerInfluence = Math.min(viewerCount / 100, 0.15); // Cap at 15% increase
            const newPrice = nft.price * (1 + viewerInfluence);
            
            // Update PNL based on viewer count if NFT is staked
            let newPnl = nft.pnl;
            if (nft.staked > 0) {
              // Higher viewer count = higher PNL
              newPnl = Math.max(nft.pnl + (viewerInfluence * 0.05), 0.02);
            }
            
            toast({
              title: "NFT Price Updated",
              description: `${nft.name} price increased by ${(viewerInfluence * 100).toFixed(2)}% due to ${creatorName}'s stream performance!`,
              duration: 4000,
            });
            
            return {
              ...nft,
              previousPrice: nft.price,
              price: newPrice,
              pnl: newPnl
            };
          }
          return nft;
        });
      });
    };
    
    document.addEventListener('streamEnded', handleStreamEnded as EventListener);
    
    return () => {
      document.removeEventListener('streamEnded', handleStreamEnded as EventListener);
    };
  }, [toast]);
  
  // Track live audiences in real-time to update NFT prices
  useEffect(() => {
    // Update NFT prices based on current live stream viewer counts
    const interval = setInterval(() => {
      if (liveStreams.length > 0) {
        setNfts(prevNfts => 
          prevNfts.map(nft => {
            // Find all live streams by this creator
            const creatorStreams = liveStreams.filter(
              stream => stream.creatorName === nft.creator || nft.creator.includes(stream.creatorName)
            );
            
            if (creatorStreams.length > 0) {
              // Calculate total viewers across all streams
              const totalViewers = creatorStreams.reduce((sum, stream) => sum + stream.viewers, 0);
              
              // More viewers = higher price increase
              const viewerInfluence = Math.min(totalViewers / 200, 0.05); // More conservative for real-time updates
              const previousPrice = nft.price;
              const newPrice = nft.price * (1 + viewerInfluence);
              
              // Calculate market cap based on price and staked amount
              const marketCapMultiplier = nft.staked > 0 ? (1 + (nft.staked / 1000)) : 1;
              const previousMarketCap = nft.marketCap;
              const newMarketCap = newPrice * 200 * marketCapMultiplier; // Assuming 200 circulating supply
              
              // Update ROI based on price change
              const roiChange = viewerInfluence * 100; // Convert to percentage
              const previousRoi = nft.roi;
              const newRoi = nft.roi + roiChange;
              
              // Update PNL if staked, based on audience size
              let pnl = nft.pnl;
              if (nft.staked > 0) {
                // Higher viewer count = higher PNL gains
                const pnlIncrease = totalViewers > 500 ? 0.05 : (totalViewers > 100 ? 0.02 : 0.01);
                pnl = Math.max(nft.pnl + pnlIncrease, 0.02);
              }
              
              return {
                ...nft,
                previousPrice,
                price: newPrice,
                previousMarketCap,
                marketCap: newMarketCap,
                previousRoi,
                roi: newRoi,
                pnl
              };
            }
            
            // If no active streams for this creator, use regular small random changes
            const priceChange = Math.random() * 3; // Smaller change without active streams
            const previousPrice = nft.price;
            const newPrice = nft.price + priceChange;
            
            // Calculate market cap based on price and staked amount
            const marketCapInfluence = nft.staked > 0 ? (nft.staked / 2000) : 0.5;
            const capChange = marketCapInfluence * Math.random() * 500;
            const previousMarketCap = nft.marketCap;
            const newMarketCap = nft.marketCap + capChange;
            
            // Update ROI with smaller change when no streams
            const roiChange = Math.random() * 0.5;
            const previousRoi = nft.roi;
            const newRoi = nft.roi + roiChange;
            
            // Update PNL with minimal increase if staked
            let pnl = nft.pnl;
            if (nft.staked > 0) {
              // Default small increase when no active streams
              pnl = Math.max(nft.pnl + 0.005, 0.02);
            }
            
            return {
              ...nft,
              previousPrice,
              price: newPrice,
              previousMarketCap,
              marketCap: newMarketCap,
              previousRoi,
              roi: newRoi,
              pnl
            };
          })
        );
      }
    }, 5000); // Update every 5 seconds to reflect audience changes
    
    return () => clearInterval(interval);
  }, [liveStreams]);
  
  const handleStakeModalOpen = (e: React.MouseEvent, nft: NFT) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedNft(nft);
    setStakeModalOpen(true);
  };
  
  const handleNftClick = (e: React.MouseEvent, nftId: number) => {
    navigate(`/nfts/${nftId}`);
  };
  
  const handleStake = () => {
    if (!selectedNft || !stakeAmount || parseFloat(stakeAmount) <= 0) return;
    
    const amount = parseFloat(stakeAmount);
    
    // Use the NFT stake handler from useTokens hook
    const success = handleNftStake(
      selectedNft.id, 
      amount, 
      `Staked ${amount} SYX on ${selectedNft.name} NFT`
    );
    
    if (success) {
      setNfts(prevNfts => 
        prevNfts.map(nft => {
          if (nft.id === selectedNft.id) {
            // Set initial PNL based on stake amount
            let initialPnl = 0.02; // Default starting PNL
            
            if (amount >= 500) {
              initialPnl = 0.9; // Higher starting PNL for large stakes
            }
            
            // Update market cap immediately based on stake amount
            const newMarketCap = nft.marketCap + (amount * 0.8);
            
            const updatedNft = {
              ...nft, 
              staked: nft.staked + amount,
              pnl: initialPnl, // Start with initial PNL
              marketCap: newMarketCap, // Immediately increase market cap
              previousMarketCap: nft.marketCap // Store previous market cap
            };
            
            // Save staked NFTs to localStorage for dashboard synchronization
            const stakedNFTs = JSON.parse(localStorage.getItem("stakedNFTs") || "[]");
            const existingIndex = stakedNFTs.findIndex((n: NFT) => n.id === nft.id);
            
            if (existingIndex >= 0) {
              stakedNFTs[existingIndex] = updatedNft;
            } else {
              stakedNFTs.push(updatedNft);
            }
            
            localStorage.setItem("stakedNFTs", JSON.stringify(stakedNFTs));
            
            return updatedNft;
          }
          return nft;
        })
      );
      
      setStakeAmount("");
      setStakeModalOpen(false);
      setSelectedNft(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-20">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">NFTs Gallery</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nfts.map((nft) => (
          <Card 
            key={nft.id}
            className="bg-black border border-white/10 overflow-hidden hover:border-streamixy-primary/50 transition-colors cursor-pointer"
            onClick={(e) => handleNftClick(e, nft.id)}
          >
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
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white">Available Balance:</span>
                  <span className="font-bold text-white">{tokenBalance} SYX</span>
                </div>
                <label className="text-sm text-white mb-1 block">Amount to Stake</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="bg-transparent border-white/20 text-white placeholder:text-white/50"
                  max={tokenBalance}
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
                onClick={(e) => {
                  e.stopPropagation();
                  setStakeModalOpen(false);
                  setSelectedNft(null);
                  setStakeAmount("");
                }}
              >
                Cancel
              </Button>
              <Button 
                className="w-1/2 bg-streamixy-primary hover:bg-streamixy-primary/80"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStake();
                }}
                disabled={!stakeAmount || parseFloat(stakeAmount) <= 0 || parseFloat(stakeAmount) > tokenBalance}
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


import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface NFT {
  id: string;
  name: string;
  image: string;
  price: number;
  stakedAmount: number;
}

const CreatorProfile = () => {
  const { username } = useParams();
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);

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
        stakedAmount: 0,
      }
    ],
    pastStreams: [
      {
        id: "1",
        title: "Building a Web3 Metaverse in Real-Time",
        thumbnail: "https://source.unsplash.com/featured/400x225?gaming",
        views: 1254,
        date: "2024-04-26",
      }
    ],
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: isFollowing 
        ? `You have unfollowed ${creator.name}` 
        : `You are now following ${creator.name}`,
    });
  };

  const handleStakeNFT = (nft: NFT) => {
    toast({
      title: "Staking NFT",
      description: `Staking tokens on ${nft.name}...`,
    });
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {creator.nfts.map((nft) => (
            <Card key={nft.id} className="bg-black/50 border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">{nft.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <div className="flex justify-between items-center">
                  <p className="text-white/70">
                    Price: {nft.price} <span className="text-streamixy-primary">SYX</span>
                  </p>
                  <Button
                    onClick={() => handleStakeNFT(nft)}
                    className="bg-streamixy-primary"
                  >
                    Stake
                  </Button>
                </div>
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
                <img
                  src={stream.thumbnail}
                  alt={stream.title}
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
                <h3 className="font-semibold mb-1">{stream.title}</h3>
                <p className="text-sm text-white/70">
                  {stream.views.toLocaleString()} views · {stream.date}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreatorProfile;

import React, { useState, useEffect } from "react";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  User,
  Users,
  Wallet,
  Link as LinkIcon,
  Share,
  ArrowUpRight,
  History,
  Image as ImageIcon,
  Edit,
  ArrowRight,
  TrendingUp,
  Copy,
  Check,
  DollarSign,
  Music,
  Video
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { toast } from "@/components/ui/use-toast";
import { 
  Dialog,
  DialogContent, 
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import CreateNFTForm from "@/components/CreateNFTForm";
import { Badge } from "@/components/ui/badge";
import { BadgeDollarSign } from "@/components/ui/badge-dollar-sign";

interface Transaction {
  id: number;
  type: "stake" | "withdraw" | "earn" | "gift" | "referral";
  amount: number;
  date: Date;
  details: string;
}

interface StakedNFT {
  id: number;
  name: string;
  amount: number;
  roi: number;
  pnl: number;
}

const Dashboard = () => {
  const [mode, setMode] = useState<"creator" | "audience">("creator");
  const [walletConnected, setWalletConnected] = useState(false);
  const [profile, setProfile] = useState({
    nickname: "StreamerXYZ",
    avatar: ""
  });
  const [editProfile, setEditProfile] = useState({
    nickname: "",
    avatar: ""
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [earnings, setEarnings] = useState(0);
  const [referralCopied, setReferralCopied] = useState(false);
  const [followers, setFollowers] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stakedNFTs, setStakedNFTs] = useState<StakedNFT[]>([]);
  const { toast: showToast } = useToast();

  useEffect(() => {
    const randomEarnings = Math.floor(Math.random() * 10000) + 1000;
    setEarnings(randomEarnings);
    
    const randomFollowers = Math.floor(Math.random() * 5000) + 500;
    setFollowers(randomFollowers);
    
    const sampleTransactions: Transaction[] = [
      {
        id: 1,
        type: "earn",
        amount: 250,
        date: new Date(Date.now() - 3600000),
        details: "Stream earnings"
      },
      {
        id: 2,
        type: "gift",
        amount: 150,
        date: new Date(Date.now() - 7200000),
        details: "Gift from @viewer123"
      },
      {
        id: 3,
        type: "stake",
        amount: 500,
        date: new Date(Date.now() - 86400000),
        details: "Staked for 3 weeks"
      },
      {
        id: 4,
        type: "withdraw",
        amount: -200,
        date: new Date(Date.now() - 172800000),
        details: "Withdrawal to wallet"
      },
      {
        id: 5,
        type: "referral",
        amount: 300,
        date: new Date(Date.now() - 259200000),
        details: "Referral bonus: @newuser1"
      }
    ];
    setTransactions(sampleTransactions);
    
    const sampleStakedNFTs: StakedNFT[] = [
      {
        id: 1,
        name: "Streamixy Genesis",
        amount: 250,
        roi: 12.5,
        pnl: 31.25
      },
      {
        id: 2,
        name: "Digital Dreamscape",
        amount: 180,
        roi: -4.2,
        pnl: -7.56
      },
      {
        id: 3,
        name: "Virtual Reality",
        amount: 320,
        roi: 6.8,
        pnl: 21.76
      }
    ];
    setStakedNFTs(sampleStakedNFTs);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setEarnings(prev => {
        const change = Math.random() * 10 - 3;
        return Math.max(0, prev + change);
      });
      
      if (Math.random() > 0.7) {
        setFollowers(prev => {
          const change = Math.floor(Math.random() * 3);
          return prev + change;
        });
        
        if (mode === "creator") {
          showToast({
            title: "New Follower!",
            description: "Someone just followed your channel.",
            duration: 2000,
          });
        }
      }
      
      setStakedNFTs(prev => 
        prev.map(nft => {
          const roiChange = (Math.random() * 2) - 1;
          const newRoi = nft.roi + roiChange;
          const newPnl = (nft.amount * newRoi) / 100;
          return {
            ...nft,
            roi: newRoi,
            pnl: newPnl
          };
        })
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [mode, showToast]);

  const connectWallet = () => {
    setWalletConnected(true);
    showToast({
      title: "Wallet Connected",
      description: "Your wallet has been successfully connected.",
      duration: 3000,
    });
  };

  const startEditProfile = () => {
    setEditProfile({
      nickname: profile.nickname,
      avatar: profile.avatar
    });
    setIsEditingProfile(true);
  };

  const saveProfile = () => {
    setProfile({
      nickname: editProfile.nickname,
      avatar: editProfile.avatar
    });
    setIsEditingProfile(false);
    showToast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
      duration: 3000,
    });
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(`https://streamixy.io/ref/${profile.nickname}`);
    setReferralCopied(true);
    showToast({
      title: "Referral Link Copied",
      description: "Referral link copied to clipboard.",
      duration: 3000,
    });
    setTimeout(() => setReferralCopied(false), 2000);
  };

  const shareReferral = (platform: string) => {
    const referralLink = `https://streamixy.io/ref/${profile.nickname}`;
    let shareUrl = "";
    
    switch(platform) {
      case "whatsapp":
        shareUrl = `https://wa.me/?text=Join%20me%20on%20Streamixy!%20${encodeURIComponent(referralLink)}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=Join%20me%20on%20Streamixy!`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
        break;
      case "instagram":
        shareUrl = `https://instagram.com`;
        showToast({
          title: "Instagram",
          description: "Copy the link and paste it in your Instagram story or DMs.",
          duration: 3000,
        });
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, "_blank");
    }
  };

  const withdrawTokens = () => {
    if (earnings > 0) {
      const newTransaction: Transaction = {
        id: Date.now(),
        type: "withdraw",
        amount: -earnings,
        date: new Date(),
        details: "Withdrawal to wallet"
      };
      setTransactions(prev => [newTransaction, ...prev]);
      
      setEarnings(0);
      
      showToast({
        title: "Withdrawal Successful",
        description: `${earnings.toFixed(2)} SYX tokens have been sent to your wallet.`,
        duration: 3000,
      });
    }
  };

  const claimReferralBonus = () => {
    const newTransaction: Transaction = {
      id: Date.now(),
      type: "referral",
      amount: 200,
      date: new Date(),
      details: "Referral bonus claimed"
    };
    setTransactions(prev => [newTransaction, ...prev]);
    
    setEarnings(prev => prev + 200);
    
    showToast({
      title: "Referral Bonus Claimed",
      description: "200 SYX tokens have been added to your balance.",
      duration: 3000,
    });
  };

  const handleNFTCreated = () => {
    const newTransaction: Transaction = {
      id: Date.now(),
      type: "stake",
      amount: 15,
      date: new Date(),
      details: "Created NFT"
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    
    showToast({
      title: "NFT Created",
      description: "Your NFT is now visible in the marketplace.",
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-2 sm:p-4 pb-20">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-white">Dashboard</h1>
        <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-white/20 hover:bg-white/10 text-white"
              onClick={startEditProfile}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black border border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription className="text-white">
                Update your profile information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.avatar} alt={profile.nickname} />
                  <AvatarFallback className="bg-streamixy-primary/20 text-streamixy-primary text-xl">
                    {profile.nickname.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs border-white/20 text-white"
                >
                  <ImageIcon className="h-3 w-3 mr-1" /> 
                  Upload Photo
                </Button>
              </div>
              <div className="space-y-2">
                <label htmlFor="nickname" className="text-sm text-white">
                  Nickname
                </label>
                <Input 
                  id="nickname"
                  value={editProfile.nickname}
                  onChange={(e) => setEditProfile({...editProfile, nickname: e.target.value})}
                  className="bg-transparent border-white/20 text-white"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditingProfile(false)}
                  className="border-white/20 text-white"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={saveProfile}
                  className="bg-streamixy-primary hover:bg-streamixy-primary/80 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center mb-6">
        <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border-2 border-streamixy-primary">
          <AvatarImage src={profile.avatar} alt={profile.nickname} />
          <AvatarFallback className="bg-streamixy-primary/20 text-streamixy-primary text-xl">
            {profile.nickname.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="ml-4">
          <h2 className="text-lg sm:text-xl font-bold text-white">{profile.nickname}</h2>
          <p className="text-sm text-white">
            {walletConnected 
              ? `Wallet: 0x...${Math.random().toString(36).substring(2, 8)}` 
              : 'Wallet Not Connected'}
          </p>
        </div>
      </div>

      <Tabs defaultValue="creator" className="mb-6" onValueChange={(value) => setMode(value as "creator" | "audience")}>
        <TabsList className="grid w-full grid-cols-2 bg-black border border-white/10">
          <TabsTrigger value="creator" className="data-[state=active]:bg-streamixy-primary text-white">
            <User className="h-4 w-4 mr-2" />
            Creator Mode
          </TabsTrigger>
          <TabsTrigger value="audience" className="data-[state=active]:bg-streamixy-primary text-white">
            <Users className="h-4 w-4 mr-2" />
            Audience Mode
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="creator" className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-black border border-white/10 overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center text-white">
                  <Users className="h-4 w-4 mr-1.5 text-streamixy-primary" />
                  Followers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{followers.toLocaleString()}</div>
                <div className="text-xs text-white">+{(followers * 0.05).toFixed(0)} this week</div>
              </CardContent>
            </Card>
            
            <Card className="bg-black border border-white/10 overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center text-white">
                  <BadgeDollarSign className="mr-1 text-streamixy-primary" />
                  Creator Earnings (SYX)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{earnings.toFixed(2)}</div>
                <Button 
                  size="sm" 
                  className="mt-2 text-xs bg-streamixy-primary hover:bg-streamixy-primary/80 text-white"
                  onClick={withdrawTokens}
                >
                  Withdraw
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {!walletConnected && (
            <Button 
              onClick={connectWallet}
              className="w-full mt-2 bg-streamixy-primary hover:bg-streamixy-primary/80 flex items-center justify-center text-white"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          )}
          
          <CreateNFTForm onSuccess={handleNFTCreated} />
          
          <Card className="bg-black border border-white/10">
            <CardHeader>
              <CardTitle className="text-base flex items-center text-white">
                <LinkIcon className="h-4 w-4 mr-2 text-streamixy-primary" />
                Referral Link
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input 
                  readOnly 
                  value={`https://streamixy.io/ref/${profile.nickname}`} 
                  className="bg-transparent border-white/20 text-white text-sm"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={copyReferralLink}
                  className="sm:ml-2 border-white/20"
                >
                  {referralCopied ? 
                    <Check className="h-4 w-4 text-green-500" /> : 
                    <Copy className="h-4 w-4 text-white" />}
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <p className="text-xs text-white">Share with friends and earn 200 SYX per referral</p>
                <Button 
                  size="sm" 
                  onClick={() => claimReferralBonus()}
                  className="text-xs bg-streamixy-primary/20 hover:bg-streamixy-primary/30 text-streamixy-primary w-full sm:w-auto"
                >
                  Claim 200 SYX
                </Button>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Button 
                  variant="outline"
                  size="sm"
                  className="w-full border-white/20 hover:bg-white/5 text-white text-xs"
                  onClick={() => shareReferral("whatsapp")}
                >
                  <Share className="h-3 w-3 mr-1" /> WhatsApp
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  className="w-full border-white/20 hover:bg-white/5 text-white text-xs"
                  onClick={() => shareReferral("telegram")}
                >
                  <Share className="h-3 w-3 mr-1" /> Telegram
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  className="w-full border-white/20 hover:bg-white/5 text-white text-xs"
                  onClick={() => shareReferral("facebook")}
                >
                  <Share className="h-3 w-3 mr-1" /> Facebook
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  className="w-full border-white/20 hover:bg-white/5 text-white text-xs"
                  onClick={() => shareReferral("instagram")}
                >
                  <Share className="h-3 w-3 mr-1" /> Instagram
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black border border-white/10">
            <CardHeader>
              <CardTitle className="text-base flex items-center text-white">
                <History className="h-4 w-4 mr-2 text-streamixy-primary" />
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map(transaction => (
                  <div 
                    key={transaction.id} 
                    className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0"
                  >
                    <div>
                      <div className="font-medium text-white">
                        {transaction.type === "earn" && "Stream Earnings"}
                        {transaction.type === "gift" && "Gift Received"}
                        {transaction.type === "stake" && "Tokens Staked"}
                        {transaction.type === "withdraw" && "Withdrawal"}
                        {transaction.type === "referral" && "Referral Bonus"}
                      </div>
                      <div className="text-xs text-white">
                        {transaction.date.toLocaleString()} • {transaction.details}
                      </div>
                    </div>
                    <div className={`font-semibold ${transaction.amount > 0 ? 'text-green-500' : 'text-red-400'}`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)} SYX
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="audience" className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-black border border-white/10 overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center text-white">
                  <Wallet className="h-4 w-4 mr-1.5 text-streamixy-primary" />
                  Balance (SYX)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{earnings.toFixed(2)}</div>
                <Button 
                  size="sm" 
                  className="mt-2 text-xs bg-streamixy-primary hover:bg-streamixy-primary/80 text-white"
                  onClick={withdrawTokens}
                >
                  Withdraw
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-black border border-white/10 overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center text-white">
                  <TrendingUp className="h-4 w-4 mr-1.5 text-streamixy-primary" />
                  NFTs Staked
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stakedNFTs.length}</div>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="mt-2 text-xs border-white/20 hover:bg-white/5 text-white"
                  onClick={() => window.location.href = '/nfts'}
                >
                  View NFTs
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {!walletConnected && (
            <Button 
              onClick={connectWallet}
              className="w-full mt-2 bg-streamixy-primary hover:bg-streamixy-primary/80 flex items-center justify-center text-white"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          )}
          
          <Card className="bg-black border border-white/10">
            <CardHeader>
              <CardTitle className="text-base flex items-center text-white">
                <TrendingUp className="h-4 w-4 mr-2 text-streamixy-primary" />
                Your Staked NFTs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stakedNFTs.map(nft => (
                  <div 
                    key={nft.id}
                    className="p-3 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-medium text-white">{nft.name}</div>
                      <div className="flex items-center">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="h-6 text-xs text-white hover:text-white"
                          onClick={() => window.location.href = '/nfts'}
                        >
                          Details
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                      <div>
                        <div className="text-white text-xs">Staked</div>
                        <div className="font-medium text-white">{nft.amount.toFixed(2)} SYX</div>
                      </div>
                      <div>
                        <div className="text-white text-xs">ROI</div>
                        <div className={`font-medium ${nft.roi > 0 ? 'text-green-500' : 'text-red-400'}`}>
                          {nft.roi > 0 ? '+' : ''}{nft.roi.toFixed(2)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-white text-xs">P&L</div>
                        <div className={`font-medium ${nft.pnl > 0 ? 'text-green-500' : 'text-red-400'}`}>
                          {nft.pnl > 0 ? '+' : ''}{nft.pnl.toFixed(2)} SYX
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {stakedNFTs.length === 0 && (
                  <div className="text-center py-6 text-white">
                    <p>You haven't staked on any NFTs yet.</p>
                    <Button 
                      variant="link" 
                      className="text-streamixy-primary mt-2"
                      onClick={() => window.location.href = '/nfts'}
                    >
                      Browse NFT marketplace
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black border border-white/10">
            <CardHeader>
              <CardTitle className="text-base flex items-center text-white">
                <LinkIcon className="h-4 w-4 mr-2 text-streamixy-primary" />
                Referral Link
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex">
                <Input 
                  readOnly 
                  value={`https://streamixy.io/ref/${profile.nickname}`} 
                  className="bg-transparent border-white/20 text-white"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={copyReferralLink}
                  className="ml-2 border-white/20"
                >
                  {referralCopied ? 
                    <Check className="h-4 w-4 text-green-500" /> : 
                    <Copy className="h-4 w-4 text-white" />}
                </Button>
              </div>
              
              <div className="flex justify-between">
                <p className="text-xs text-white">Share with friends and earn 200 SYX per referral</p>
                <Button 
                  size="sm" 
                  onClick={() => claimReferralBonus()}
                  className="text-xs bg-streamixy-primary/20 hover:bg-streamixy-primary/30 text-streamixy-primary"
                >
                  Claim 200 SYX
                </Button>
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button 
                  variant="outline"
                  size="sm"
                  className="flex-1 border-white/20 hover:bg-white/5 text-white text-xs"
                  onClick={() => shareReferral("whatsapp")}
                >
                  <Share className="h-3 w-3 mr-1" /> WhatsApp
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  className="flex-1 border-white/20 hover:bg-white/5 text-white text-xs"
                  onClick={() => shareReferral("telegram")}
                >
                  <Share className="h-3 w-3 mr-1" /> Telegram
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  className="flex-1 border-white/20 hover:bg-white/5 text-white text-xs"
                  onClick={() => shareReferral("facebook")}
                >
                  <Share className="h-3 w-3 mr-1" /> Facebook
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  className="flex-1 border-white/20 hover:bg-white/5 text-white text-xs"
                  onClick={() => shareReferral("instagram")}
                >
                  <Share className="h-3 w-3 mr-1" /> Instagram
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black border border-white/10">
            <CardHeader>
              <CardTitle className="text-base flex items-center text-white">
                <History className="h-4 w-4 mr-2 text-streamixy-primary" />
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map(transaction => (
                  <div 
                    key={transaction.id} 
                    className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0"
                  >
                    <div>
                      <div className="font-medium text-white">
                        {transaction.type === "earn" && "Stream Earnings"}
                        {transaction.type === "gift" && "Gift Sent"}
                        {transaction.type === "stake" && "Tokens Staked"}
                        {transaction.type === "withdraw" && "Withdrawal"}
                        {transaction.type === "referral" && "Referral Bonus"}
                      </div>
                      <div className="text-xs text-white">
                        {transaction.date.toLocaleString()} • {transaction.details}
                      </div>
                    </div>
                    <div className={`font-semibold ${transaction.amount > 0 ? 'text-green-500' : 'text-red-400'}`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)} SYX
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;


import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Video, Trophy, Coins, Image, LayoutDashboard } from "lucide-react";

const BottomNav = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/10 py-2 px-2 z-50">
      <div className="flex justify-between items-center px-2">
        <Link to="/" className={`flex flex-col items-center ${isActive('/') ? 'text-streamixy-primary' : 'text-white/70'}`}>
          <Home className="h-4 w-4" />
          <span className="text-[9px] mt-0.5">Home</span>
        </Link>
        <Link to="/go-live" className={`flex flex-col items-center ${isActive('/go-live') ? 'text-streamixy-primary' : 'text-white/70'}`}>
          <Video className="h-4 w-4" />
          <span className="text-[9px] mt-0.5">Go Live</span>
        </Link>
        <Link to="/leaderboard" className={`flex flex-col items-center ${isActive('/leaderboard') ? 'text-streamixy-primary' : 'text-white/70'}`}>
          <Trophy className="h-4 w-4" />
          <span className="text-[9px] mt-0.5">Rank</span>
        </Link>
        <Link to="/stake" className={`flex flex-col items-center ${isActive('/stake') ? 'text-streamixy-primary' : 'text-white/70'}`}>
          <Coins className="h-4 w-4" />
          <span className="text-[9px] mt-0.5">Stake</span>
        </Link>
        <Link to="/nfts" className={`flex flex-col items-center ${isActive('/nfts') ? 'text-streamixy-primary' : 'text-white/70'}`}>
          <Image className="h-4 w-4" />
          <span className="text-[9px] mt-0.5">NFTs</span>
        </Link>
        <Link to="/dashboard" className={`flex flex-col items-center ${isActive('/dashboard') ? 'text-streamixy-primary' : 'text-white/70'}`}>
          <LayoutDashboard className="h-4 w-4" />
          <span className="text-[9px] mt-0.5">Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;

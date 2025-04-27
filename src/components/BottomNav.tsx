
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Video, List, BarChart3, Trophy } from "lucide-react";

const BottomNav = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/10 py-2 px-4 z-50">
      <div className="flex justify-around items-center">
        <Link to="/" className={`flex flex-col items-center ${isActive('/') ? 'text-streamixy-primary' : 'text-white/70'}`}>
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link to="/go-live" className={`flex flex-col items-center ${isActive('/go-live') ? 'text-streamixy-primary' : 'text-white/70'}`}>
          <Video className="h-6 w-6" />
          <span className="text-xs mt-1">Go Live</span>
        </Link>
        <Link to="/leaderboard" className={`flex flex-col items-center ${isActive('/leaderboard') ? 'text-streamixy-primary' : 'text-white/70'}`}>
          <Trophy className="h-6 w-6" />
          <span className="text-xs mt-1">Leaderboard</span>
        </Link>
        <Link to="/nfts" className={`flex flex-col items-center ${isActive('/nfts') ? 'text-streamixy-primary' : 'text-white/70'}`}>
          <List className="h-6 w-6" />
          <span className="text-xs mt-1">NFTs</span>
        </Link>
        <Link to="/stake" className={`flex flex-col items-center ${isActive('/stake') ? 'text-streamixy-primary' : 'text-white/70'}`}>
          <BarChart3 className="h-6 w-6" />
          <span className="text-xs mt-1">Stake</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;

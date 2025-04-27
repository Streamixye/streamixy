
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Video, Trophy, BarChart3 } from "lucide-react";

const BottomNav = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/10 py-2 px-2 z-50">
      <div className="flex justify-around items-center">
        <Link to="/" className={`flex flex-col items-center ${isActive('/') ? 'text-streamixy-primary' : 'text-white/70'}`}>
          <Home className="h-5 w-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </Link>
        <Link to="/go-live" className={`flex flex-col items-center ${isActive('/go-live') ? 'text-streamixy-primary' : 'text-white/70'}`}>
          <Video className="h-5 w-5" />
          <span className="text-[10px] mt-0.5">Go Live</span>
        </Link>
        <Link to="/leaderboard" className={`flex flex-col items-center ${isActive('/leaderboard') ? 'text-streamixy-primary' : 'text-white/70'}`}>
          <Trophy className="h-5 w-5" />
          <span className="text-[10px] mt-0.5">Rank</span>
        </Link>
        <Link to="/dashboard" className={`flex flex-col items-center ${isActive('/dashboard') ? 'text-streamixy-primary' : 'text-white/70'}`}>
          <BarChart3 className="h-5 w-5" />
          <span className="text-[10px] mt-0.5">Stats</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;

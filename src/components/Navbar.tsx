
import React from "react";

const Navbar: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent py-4 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-white">
            <span className="text-streamixy-primary">stream</span>
            <span className="text-streamixy-accent">ixy</span>
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <div className="glass px-3 py-1 rounded-full flex items-center">
            <span className="text-streamixy-highlight font-bold text-sm">Following</span>
          </div>
          <div className="glass px-3 py-1 rounded-full flex items-center">
            <span className="text-white text-sm">For You</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

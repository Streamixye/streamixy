
import React from "react";

const Navbar: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent py-4 px-4">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-white">
          <span className="text-streamixy-primary">stream</span>
          <span className="text-streamixy-accent">ixy</span>
        </h1>
      </div>
    </header>
  );
};

export default Navbar;

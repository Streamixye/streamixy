
import React from "react";

const NFTs = () => {
  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold mb-4">NFTs Gallery</h1>
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="glass p-4 rounded-lg aspect-square">
            <div className="w-full h-full bg-streamixy-dark/50 rounded-lg flex items-center justify-center">
              NFT #{item}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NFTs;


import React from "react";

const GoLive = () => {
  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Go Live</h1>
      <div className="glass p-6 rounded-lg">
        <p className="text-streamixy-light mb-4">Start your live stream</p>
        <button className="bg-streamixy-primary px-6 py-2 rounded-full hover:bg-streamixy-primary/80 transition-colors">
          Start Streaming
        </button>
      </div>
    </div>
  );
};

export default GoLive;

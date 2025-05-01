
import React from "react";
import { Volume2, VolumeX } from "lucide-react";

interface VideoOverlaysProps {
  isLive: boolean;
  displayedViewers: number;
  isMuted: boolean;
  toggleMute: (e: React.MouseEvent) => void;
}

export const VideoOverlays: React.FC<VideoOverlaysProps> = ({
  isLive,
  displayedViewers,
  isMuted,
  toggleMute
}) => {
  return (
    <>
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {isLive && (
        <div className="absolute top-4 left-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1 animate-pulse pointer-events-none">
          <span className="h-2 w-2 bg-white rounded-full"></span>
          <span>LIVE</span>
        </div>
      )}

      <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full flex items-center space-x-1 pointer-events-none">
        <span className="text-xs text-white animate-pulse">{displayedViewers} viewers</span>
      </div>

      {/* Volume control button - moved slightly higher (from bottom-6 to bottom-10) */}
      <div className="absolute bottom-10 right-6 z-10">
        <button 
          className="bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-streamixy-primary/30 transition-all"
          onClick={toggleMute}
        >
          {!isMuted ? (
            <Volume2 className="text-white h-6 w-6" />
          ) : (
            <VolumeX className="text-white h-6 w-6" />
          )}
        </button>
      </div>
    </>
  );
};

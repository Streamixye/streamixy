
import React from "react";
import { Heart } from "lucide-react";

interface LikeAnimationsProps {
  animations: {id: number, x: number, y: number}[];
}

export const LikeAnimations: React.FC<LikeAnimationsProps> = ({ animations }) => {
  return (
    <>
      {animations.map(like => (
        <div 
          key={like.id}
          className="absolute animate-like-float pointer-events-none"
          style={{ 
            left: `${like.x}%`,
            top: `${like.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Heart className="text-pink-500 h-12 w-12 fill-pink-500" />
        </div>
      ))}
    </>
  );
};

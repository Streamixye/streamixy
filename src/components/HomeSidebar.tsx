
import React, { useState } from "react";
import { Heart } from "lucide-react";
import { 
  Sidebar, 
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";

interface HeartAnimation {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
}

const HomeSidebar = () => {
  const [hearts, setHearts] = useState<HeartAnimation[]>([]);
  const [heartCounter, setHeartCounter] = useState(0);
  const { toast } = useToast();

  const handleLoveClick = () => {
    // Create a heart animation that appears at a random position on the screen
    const newHeart: HeartAnimation = {
      id: heartCounter,
      x: Math.random() * 70 + 20, // 20% to 90% of screen width
      y: Math.random() * 70 + 10, // 10% to 80% of screen height
      size: Math.random() * 30 + 30, // 30px to 60px
      rotation: Math.random() * 40 - 20 // -20 to +20 degrees
    };

    // Add the new heart to the array
    setHearts(prev => [...prev, newHeart]);
    setHeartCounter(prev => prev + 1);

    // Show a toast message every 5th heart
    if (heartCounter % 5 === 0 && heartCounter > 0) {
      toast({
        title: "Loving it!",
        description: `You've sent ${heartCounter + 1} hearts!`,
      });
    }

    // Remove the heart after animation completes
    setTimeout(() => {
      setHearts(prev => prev.filter(heart => heart.id !== newHeart.id));
    }, 2000);
  };

  return (
    <>
      <Sidebar side="left" variant="inset">
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLoveClick}
                tooltip="Send Love"
                className="hover:bg-pink-500/20"
              >
                <Heart className="text-pink-500" />
                <span>Love</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      {/* Heart animations */}
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="fixed animate-heart-float pointer-events-none"
          style={{
            left: `${heart.x}%`,
            top: `${heart.y}%`,
            zIndex: 1000,
            transform: `scale(${heart.size/40}) rotate(${heart.rotation}deg)`
          }}
        >
          <Heart className="text-pink-500 fill-pink-500" size={40} />
        </div>
      ))}
    </>
  );
};

export default HomeSidebar;

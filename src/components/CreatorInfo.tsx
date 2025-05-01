
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface CreatorInfoProps {
  creator: {
    name: string;
    username: string;
    avatar: string;
    followers: number;
  };
  className?: string;
}

const CreatorInfo: React.FC<CreatorInfoProps> = ({ creator, className }) => {
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(creator.followers);
  
  // Check if already following on component mount
  useEffect(() => {
    const followingCreators = JSON.parse(localStorage.getItem("followingCreators") || "[]");
    const alreadyFollowing = followingCreators.some((c: string) => c === creator.username);
    setIsFollowing(alreadyFollowing);
    
    // Update follower count from localStorage if available
    const storedCount = localStorage.getItem(`followerCount_${creator.username}`);
    if (storedCount) {
      setFollowerCount(parseInt(storedCount));
    }
    
    // Listen for follow events from other components
    const handleFollowChange = (e: Event) => {
      const event = e as CustomEvent;
      if (event.detail.username === creator.username) {
        setIsFollowing(event.detail.isFollowing);
        setFollowerCount(event.detail.newFollowerCount);
      }
    };
    
    document.addEventListener('creatorFollowChange', handleFollowChange as EventListener);
    
    return () => {
      document.removeEventListener('creatorFollowChange', handleFollowChange as EventListener);
    };
  }, [creator.username]);
  
  const handleFollowToggle = () => {
    const followingCreators = JSON.parse(localStorage.getItem("followingCreators") || "[]");
    
    if (isFollowing) {
      // Unfollow the creator
      const updatedFollowing = followingCreators.filter((c: string) => c !== creator.username);
      localStorage.setItem("followingCreators", JSON.stringify(updatedFollowing));
      setIsFollowing(false);
      setFollowerCount(prev => {
        const newCount = Math.max(prev - 1, 0);
        localStorage.setItem(`followerCount_${creator.username}`, newCount.toString());
        return newCount;
      });
      
      toast({
        title: "Unfollowed",
        description: `You unfollowed ${creator.name}`,
      });
    } else {
      // Follow the creator
      followingCreators.push(creator.username);
      localStorage.setItem("followingCreators", JSON.stringify(followingCreators));
      setIsFollowing(true);
      setFollowerCount(prev => {
        const newCount = prev + 1;
        localStorage.setItem(`followerCount_${creator.username}`, newCount.toString());
        return newCount;
      });
      
      toast({
        title: "Following!",
        description: `You are now following ${creator.name}`,
      });
    }
    
    // Dispatch a custom event to notify other components
    const event = new CustomEvent('creatorFollowChange', { 
      detail: { 
        username: creator.username, 
        isFollowing: !isFollowing,
        newFollowerCount: isFollowing ? followerCount - 1 : followerCount + 1
      } 
    });
    document.dispatchEvent(event);
    
    // Also dispatch a dashboard update event
    const dashboardEvent = new CustomEvent('dashboardUpdate', {
      detail: {
        type: 'followers',
        username: creator.username,
        isFollowing: !isFollowing,
        followerCount: isFollowing ? followerCount - 1 : followerCount + 1
      }
    });
    document.dispatchEvent(dashboardEvent);
  };

  return (
    <div className={cn("flex items-center space-x-3", className)}>
      <div className="relative">
        <img
          src={creator.avatar}
          alt={creator.name}
          className="h-12 w-12 rounded-full border-2 border-streamixy-primary"
        />
        <div className="absolute -bottom-1 -right-1 bg-streamixy-primary text-xs text-white rounded-full px-1">
          SYX
        </div>
      </div>
      <div className="flex flex-col">
        <h4 className="font-bold text-white">{creator.name}</h4>
        <p className="text-xs text-gray-300">@{creator.username}</p>
        <p className="text-xs text-gray-400">
          {followerCount.toLocaleString()} followers
        </p>
      </div>
      <Button
        size="sm"
        className={`ml-2 ${isFollowing ? "bg-white text-black hover:bg-white/80" : "bg-streamixy-primary hover:bg-streamixy-primary/80"}`}
        onClick={handleFollowToggle}
      >
        {isFollowing ? "Following" : "Follow"}
      </Button>
    </div>
  );
};

export default CreatorInfo;

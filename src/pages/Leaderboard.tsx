
import React, { useState, useEffect } from "react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown,
  Award
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";

// Creator data structure
interface Creator {
  id: number;
  name: string;
  nickname: string;
  avatar: string;
  audienceCount: number;
  earnings: number;
  previousRank: number;
  trend: "up" | "down" | "stable";
}

const Leaderboard = () => {
  const [timeFrame, setTimeFrame] = useState<"daily" | "weekly">("daily");
  const [creators, setCreators] = useState<Creator[]>([]);
  const { toast } = useToast();

  // Initialize creator data
  useEffect(() => {
    const initialCreators = Array(20).fill(null).map((_, index) => ({
      id: index + 1,
      name: `Creator ${index + 1}`,
      nickname: `creator${index + 1}`,
      avatar: "",
      audienceCount: Math.floor(Math.random() * 10000) + 1000,
      earnings: Math.floor(Math.random() * 50000) + 5000,
      previousRank: index + 1,
      trend: "stable" as "up" | "down" | "stable"
    }));
    
    setCreators(initialCreators);
    
    // Show a welcome toast
    toast({
      title: "Leaderboard Updated",
      description: "Welcome to the Streamixy creator rankings!",
      duration: 3000,
    });
  }, [toast]);

  // Simulate real-time changes
  useEffect(() => {
    const interval = setInterval(() => {
      setCreators(prevCreators => {
        // Clone the array to avoid direct state mutation
        const newCreators = [...prevCreators];
        
        // Randomly select 2-4 creators to update
        const numberOfUpdates = Math.floor(Math.random() * 3) + 2;
        
        for (let i = 0; i < numberOfUpdates; i++) {
          // Select a random creator
          const randomIndex = Math.floor(Math.random() * newCreators.length);
          const creator = { ...newCreators[randomIndex] };
          
          // Update audience count (small random change)
          const audienceChange = Math.floor(Math.random() * 100) - 50;
          creator.audienceCount = Math.max(1000, creator.audienceCount + audienceChange);
          
          // Update earnings (random change)
          const earningsChange = Math.floor(Math.random() * 500) - 100;
          creator.earnings = Math.max(1000, creator.earnings + earningsChange);
          
          // Update the creator in the array
          newCreators[randomIndex] = creator;
        }
        
        // Sort creators by earnings to update ranks
        newCreators.sort((a, b) => b.earnings - a.earnings);
        
        // Update previous rank and trend
        return newCreators.map((creator, index) => {
          const newRank = index + 1;
          const previousRank = prevCreators.findIndex(c => c.id === creator.id) + 1;
          
          let trend: "up" | "down" | "stable";
          if (newRank < previousRank) {
            trend = "up";
          } else if (newRank > previousRank) {
            trend = "down";
          } else {
            trend = "stable";
          }
          
          return {
            ...creator,
            previousRank,
            trend
          };
        });
      });
    }, 3000); // Update every 3 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setTimeFrame(value as "daily" | "weekly");
    
    // Simulate different data for daily vs weekly
    if (value === "weekly") {
      setCreators(prevCreators => {
        return prevCreators.map(creator => ({
          ...creator,
          earnings: Math.floor(creator.earnings * (Math.random() * 3 + 4)), // 4-7x for weekly
        })).sort((a, b) => b.earnings - a.earnings);
      });
    } else {
      // Reshuffle daily rankings
      setCreators(prevCreators => {
        return prevCreators.map(creator => ({
          ...creator,
          earnings: Math.floor(Math.random() * 50000) + 5000,
        })).sort((a, b) => b.earnings - a.earnings);
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-20">
      <div className="flex items-center justify-between mb-4">
        <h1 className="flex items-center text-2xl font-bold">
          <Award className="mr-2 text-streamixy-primary" />
          Creator Rankings
        </h1>
      </div>
      
      <Tabs defaultValue="daily" className="mb-4" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2 bg-black border border-white/10">
          <TabsTrigger value="daily" className="data-[state=active]:bg-streamixy-primary">Daily Top 20</TabsTrigger>
          <TabsTrigger value="weekly" className="data-[state=active]:bg-streamixy-primary">Weekly Top 20</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily" className="mt-4">
          <div className="glass p-4 rounded-lg animate-fade-in">
            <LeaderboardTable creators={creators} timeFrame="daily" />
          </div>
        </TabsContent>
        
        <TabsContent value="weekly" className="mt-4">
          <div className="glass p-4 rounded-lg animate-fade-in">
            <LeaderboardTable creators={creators} timeFrame="weekly" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface LeaderboardTableProps {
  creators: Creator[];
  timeFrame: "daily" | "weekly";
}

const LeaderboardTable = ({ creators, timeFrame }: LeaderboardTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-white/10">
            <TableHead className="text-white w-10">#</TableHead>
            <TableHead className="text-white">Creator</TableHead>
            <TableHead className="text-white text-right">Audience</TableHead>
            <TableHead className="text-white text-right">Earnings (SYX)</TableHead>
            <TableHead className="text-white text-center w-10">Trend</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {creators.map((creator, index) => (
            <TableRow 
              key={creator.id}
              className={`border-b border-white/10 transition-colors ${
                creator.trend === "up" ? "bg-green-900/10" : 
                creator.trend === "down" ? "bg-red-900/10" : ""
              } hover:bg-white/5`}
            >
              <TableCell className="font-semibold">
                {index + 1}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2 border border-white/10">
                    <AvatarImage src={creator.avatar} />
                    <AvatarFallback className="bg-streamixy-primary/20 text-streamixy-primary">
                      {creator.nickname.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{creator.name}</div>
                    <div className="text-xs text-white/70">@{creator.nickname}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right">
                {creator.audienceCount.toLocaleString()}
              </TableCell>
              <TableCell className="text-right font-semibold">
                {creator.earnings.toLocaleString()}
              </TableCell>
              <TableCell className="text-center">
                {creator.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-green-500 inline-block" />
                ) : creator.trend === "down" ? (
                  <TrendingDown className="h-4 w-4 text-red-500 inline-block" />
                ) : (
                  <div className="h-4 w-4 rounded-full bg-white/20 inline-block" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Leaderboard;

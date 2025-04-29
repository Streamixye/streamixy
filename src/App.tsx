
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import GoLive from "./pages/GoLive";
import NFTs from "./pages/NFTs";
import Stake from "./pages/Stake";
import Dashboard from "./pages/Dashboard";
import Features from "./pages/Features";
import CreatorTools from "./pages/CreatorTools";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";
import BottomNav from "./components/BottomNav";
import NFTDetail from "./pages/NFTDetail";
import CreatorProfile from "./pages/CreatorProfile";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="min-h-screen bg-black text-white pb-16">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/go-live" element={<GoLive />} />
            <Route path="/nfts" element={<NFTs />} />
            <Route path="/nfts/:id" element={<NFTDetail />} />
            <Route path="/stake" element={<Stake />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/features" element={<Features />} />
            <Route path="/creator-tools" element={<CreatorTools />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/creator/:username" element={<CreatorProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

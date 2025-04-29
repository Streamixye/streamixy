
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
import Ecosystem from "./pages/Ecosystem";
import React from "react";

// Create queryClient outside component to ensure persistence between renders
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes - helps with caching
    },
  },
});

const App = () => (
  <React.StrictMode>
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
              <Route path="/ecosystem" element={<Ecosystem />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;

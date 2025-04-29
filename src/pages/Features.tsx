
import React from "react";
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  ArrowLeft,
  Wrench,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Features = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/dashboard");
  };
  
  return (
    <div className="min-h-screen bg-black text-white p-2 sm:p-4 pb-20">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white" 
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold text-white ml-2">Features</h1>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Creator Tools Card */}
        <Card className="bg-black border border-white/10 hover:border-white/30 transition-all">
          <CardHeader>
            <Wrench className="h-6 w-6 text-streamixy-primary mb-2" />
            <CardTitle className="text-white">Creator Tools</CardTitle>
          </CardHeader>
          <CardFooter>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full bg-black border-white/20 text-white hover:bg-black/80"
              onClick={() => navigate("/creator-tools")}
            >
              Explore Tools
            </Button>
          </CardFooter>
        </Card>
        
        {/* Ecosystem Card */}
        <Card className="bg-black border border-white/10 hover:border-white/30 transition-all">
          <CardHeader>
            <Layers className="h-6 w-6 text-streamixy-primary mb-2" />
            <CardTitle className="text-white">Ecosystem</CardTitle>
          </CardHeader>
          <CardFooter>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full bg-black border-white/20 text-white hover:bg-black/80"
              onClick={() => navigate("/ecosystem")}
            >
              View Ecosystem
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Features;


import React, { useState } from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft,
  Copy,
  RefreshCw,
  Video,
  Settings,
  Code,
  Link
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CreatorTools = () => {
  const navigate = useNavigate();
  const [rtmpKey, setRtmpKey] = useState("live_12345678_abcdefgh");
  const [liveKey, setLiveKey] = useState("live_87654321_xyzabcde");
  const [streamServer, setStreamServer] = useState("rtmp://stream.streamixy.com/live");
  const [isRtmpCopied, setIsRtmpCopied] = useState(false);
  const [isLiveCopied, setIsLiveCopied] = useState(false);
  const [isServerCopied, setIsServerCopied] = useState(false);
  
  const handleBack = () => {
    navigate("/features");
  };

  const handleCopyRTMP = () => {
    navigator.clipboard.writeText(rtmpKey);
    setIsRtmpCopied(true);
    toast.success("RTMP key copied to clipboard");
    setTimeout(() => setIsRtmpCopied(false), 2000);
  };

  const handleCopyLive = () => {
    navigator.clipboard.writeText(liveKey);
    setIsLiveCopied(true);
    toast.success("Live key copied to clipboard");
    setTimeout(() => setIsLiveCopied(false), 2000);
  };

  const handleCopyServer = () => {
    navigator.clipboard.writeText(streamServer);
    setIsServerCopied(true);
    toast.success("Server URL copied to clipboard");
    setTimeout(() => setIsServerCopied(false), 2000);
  };

  const regenerateRtmpKey = () => {
    // In a real app, this would make an API call to get a new key
    const newKey = `live_${Math.random().toString(36).substring(2, 10)}_${Math.random().toString(36).substring(2, 10)}`;
    setRtmpKey(newKey);
    toast.success("Generated new RTMP key");
  };

  const regenerateLiveKey = () => {
    // In a real app, this would make an API call to get a new key
    const newKey = `live_${Math.random().toString(36).substring(2, 10)}_${Math.random().toString(36).substring(2, 10)}`;
    setLiveKey(newKey);
    toast.success("Generated new Live key");
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
          Back to Features
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold text-white ml-2">Creator Tools</h1>
      </div>

      <Tabs defaultValue="streaming" className="w-full">
        <TabsList className="grid grid-cols-2 max-w-md mb-6">
          <TabsTrigger value="streaming" className="data-[state=active]:bg-streamixy-primary">
            <Video className="h-4 w-4 mr-2" />
            Streaming
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-streamixy-primary">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="streaming" className="space-y-6">
          <Card className="bg-black border border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="h-5 w-5 mr-2 text-streamixy-primary" />
                Stream Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="server-url">Stream Server URL</Label>
                <div className="flex gap-2">
                  <Input 
                    id="server-url" 
                    value={streamServer}
                    readOnly
                    className="bg-black text-white border-white/30"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    className={isServerCopied ? "bg-green-600 text-white" : "bg-black text-white border-white/30"}
                    onClick={handleCopyServer}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-white/70">
                  Use this URL as your streaming server in OBS or other broadcasting software
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rtmp-key" className="flex items-center">
                  RTMP Stream Key
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="ml-auto text-xs text-streamixy-primary"
                    onClick={regenerateRtmpKey}
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Regenerate
                  </Button>
                </Label>
                <div className="flex gap-2">
                  <Input 
                    id="rtmp-key" 
                    value={rtmpKey}
                    readOnly
                    type="password"
                    className="bg-black text-white border-white/30"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    className={isRtmpCopied ? "bg-green-600 text-white" : "bg-black text-white border-white/30"}
                    onClick={handleCopyRTMP}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-white/70">
                  Keep this key private. Use it as your Stream Key in OBS Studio or other streaming software.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="live-key" className="flex items-center">
                  Live Stream Key
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="ml-auto text-xs text-streamixy-primary"
                    onClick={regenerateLiveKey}
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Regenerate
                  </Button>
                </Label>
                <div className="flex gap-2">
                  <Input 
                    id="live-key" 
                    value={liveKey}
                    readOnly
                    type="password"
                    className="bg-black text-white border-white/30"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    className={isLiveCopied ? "bg-green-600 text-white" : "bg-black text-white border-white/30"}
                    onClick={handleCopyLive}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-white/70">
                  This key is used for authentication and access control to your live streams.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Link className="h-5 w-5 mr-2 text-streamixy-primary" />
                Quick Connect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <Button 
                  variant="outline" 
                  className="bg-black border-white/30 text-white hover:bg-white/10"
                  onClick={() => window.open("https://obsproject.com/download", "_blank")}
                >
                  Download OBS Studio
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-black border-white/30 text-white hover:bg-white/10"
                  onClick={() => window.open("https://streamlabs.com/", "_blank")}
                >
                  Download Streamlabs
                </Button>
              </div>
              <div className="text-sm text-white/70 mt-2">
                <p>Need help setting up? Check out our tutorials:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>
                    <a href="#" className="text-streamixy-primary hover:underline">How to stream with OBS Studio</a>
                  </li>
                  <li>
                    <a href="#" className="text-streamixy-primary hover:underline">Mobile streaming setup guide</a>
                  </li>
                  <li>
                    <a href="#" className="text-streamixy-primary hover:underline">Advanced encoding settings</a>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-black border border-white/10">
            <CardHeader>
              <CardTitle>Stream Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stream-title">Stream Title</Label>
                  <Input 
                    id="stream-title" 
                    placeholder="Enter your stream title"
                    className="bg-black text-white border-white/30"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stream-description">Stream Description</Label>
                  <Input 
                    id="stream-description" 
                    placeholder="Briefly describe your stream"
                    className="bg-black text-white border-white/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stream-category">Stream Category</Label>
                  <Input 
                    id="stream-category" 
                    placeholder="Gaming, Music, Art, etc."
                    className="bg-black text-white border-white/30"
                  />
                </div>

                <div className="pt-4">
                  <Button 
                    className="w-full bg-streamixy-primary hover:bg-streamixy-primary/90"
                  >
                    Save Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border border-white/10">
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Enable Low Latency Mode</h3>
                    <p className="text-sm text-white/70">Reduces stream delay (may impact quality)</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-black border-white/30 text-white hover:bg-white/10"
                  >
                    Enable
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">DVR (Rewind) Function</h3>
                    <p className="text-sm text-white/70">Allows viewers to rewind live streams</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-black border-white/30 text-white hover:bg-white/10"
                  >
                    Enable
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Automatic Recording</h3>
                    <p className="text-sm text-white/70">Save streams automatically</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-black border-white/30 text-white hover:bg-white/10"
                  >
                    Enable
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreatorTools;

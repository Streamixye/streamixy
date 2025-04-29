
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import EcosystemFooter from "@/components/EcosystemFooter";
import { Globe, Database, Code, Rocket } from "lucide-react";
import AddProductDialog from "@/components/AddProductDialog";
import ProductsList from "@/components/ProductsList";
import TokenCreator from "@/components/TokenCreator";
import Explorer from "@/components/Explorer";
import { useToast } from "@/components/ui/use-toast";

const Ecosystem = () => {
  const [showProductDialog, setShowProductDialog] = useState(false);
  const { toast } = useToast();

  return (
    <div className="relative min-h-screen bg-black text-white pb-16">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-indigo-900/20"></div>
        {Array.from({ length: 20 }).map((_, index) => (
          <motion.div
            key={index}
            className="absolute bg-purple-500/10 rounded-full"
            style={{
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative py-20 px-4 flex flex-col items-center text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Streamixy Ecosystem
          </motion.h1>
          <motion.p 
            className="text-xl max-w-2xl mx-auto mb-8 text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            A decentralized creator economy powered by blockchain technology, 
            connecting creators and audiences directly with transparent monetization 
            and digital asset ownership.
          </motion.p>
          <motion.div 
            className="flex flex-wrap gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
              size="lg"
              onClick={() => window.open("/documentation", "_blank")}
            >
              <Code className="mr-2 h-4 w-4" /> Start Building
            </Button>
            <Button 
              variant="outline" 
              className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
              size="lg"
              onClick={() => setShowProductDialog(true)}
            >
              <Rocket className="mr-2 h-4 w-4" /> Add Your Project
            </Button>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-black/60 backdrop-blur-lg">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Ecosystem Components</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div 
                className="p-6 rounded-lg bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/20 hover:border-purple-500/40 transition-all"
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Globe className="h-10 w-10 text-purple-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Open Network</h3>
                <p className="text-gray-400">Build and deploy on our decentralized network with developer-friendly tools and APIs.</p>
              </motion.div>
              
              <motion.div 
                className="p-6 rounded-lg bg-gradient-to-br from-indigo-900/20 to-black border border-indigo-500/20 hover:border-indigo-500/40 transition-all"
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Database className="h-10 w-10 text-indigo-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Token System</h3>
                <p className="text-gray-400">Create and manage your own tokens for crowdfunding, governance, or utility.</p>
              </motion.div>
              
              <motion.div 
                className="p-6 rounded-lg bg-gradient-to-br from-pink-900/20 to-black border border-pink-500/20 hover:border-pink-500/40 transition-all"
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Code className="h-10 w-10 text-pink-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Developer Tools</h3>
                <p className="text-gray-400">Comprehensive SDKs, documentation, and testing environments to accelerate development.</p>
              </motion.div>
              
              <motion.div 
                className="p-6 rounded-lg bg-gradient-to-br from-emerald-900/20 to-black border border-emerald-500/20 hover:border-emerald-500/40 transition-all"
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Rocket className="h-10 w-10 text-emerald-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Grant Program</h3>
                <p className="text-gray-400">Financial support for innovative projects building on the Streamixy ecosystem.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Developer Tools Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Developer Hub</h2>
            
            <Tabs defaultValue="projects" className="w-full max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-md border border-white/10 rounded-lg mb-6">
                <TabsTrigger value="projects" className="data-[state=active]:text-purple-400">Projects</TabsTrigger>
                <TabsTrigger value="tokens" className="data-[state=active]:text-purple-400">Token Creator</TabsTrigger>
                <TabsTrigger value="explorer" className="data-[state=active]:text-purple-400">Explorer</TabsTrigger>
                <TabsTrigger value="grants" className="data-[state=active]:text-purple-400">Grants</TabsTrigger>
              </TabsList>
              
              <TabsContent value="projects" className="p-4 bg-black/30 backdrop-blur-md border border-white/10 rounded-lg">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-medium">Ecosystem Projects</h3>
                  <Button onClick={() => setShowProductDialog(true)} className="bg-purple-600 hover:bg-purple-700">
                    Add Project
                  </Button>
                </div>
                <ProductsList />
              </TabsContent>
              
              <TabsContent value="tokens" className="p-4 bg-black/30 backdrop-blur-md border border-white/10 rounded-lg">
                <h3 className="text-2xl font-medium mb-6">Create Tokens</h3>
                <TokenCreator />
              </TabsContent>
              
              <TabsContent value="explorer" className="p-4 bg-black/30 backdrop-blur-md border border-white/10 rounded-lg">
                <h3 className="text-2xl font-medium mb-6">Token Explorer</h3>
                <Explorer />
              </TabsContent>
              
              <TabsContent value="grants" className="p-4 bg-black/30 backdrop-blur-md border border-white/10 rounded-lg">
                <h3 className="text-2xl font-medium mb-6">Grant Program</h3>
                <div className="prose prose-invert max-w-none">
                  <p className="mb-4">
                    The Streamixy Grant Program supports innovators building on our ecosystem. 
                    We provide funding to projects that expand the decentralized creator economy.
                  </p>
                  
                  <h4 className="text-xl font-medium mt-6">Who can apply?</h4>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Developer teams building tools or applications on Streamixy</li>
                    <li>Open source projects that enhance the ecosystem</li>
                    <li>Research initiatives focused on decentralized technologies</li>
                    <li>Educational content creators focused on blockchain and Web3</li>
                  </ul>
                  
                  <h4 className="text-xl font-medium mt-6">Grant Categories</h4>
                  <ul className="list-disc pl-6 mb-4">
                    <li><strong>Developer Tools</strong>: SDKs, libraries, and other resources</li>
                    <li><strong>Applications</strong>: User-facing apps enhancing the creator economy</li>
                    <li><strong>Integration</strong>: Projects connecting Streamixy with other platforms</li>
                    <li><strong>Research</strong>: Technical research advancing the ecosystem</li>
                  </ul>
                  
                  <div className="mt-6">
                    <Button 
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                      onClick={() => {
                        toast({
                          title: "Coming Soon!",
                          description: "Grant applications will open next month. Check back soon!",
                        });
                      }}
                    >
                      Apply for Grant
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Footer */}
        <EcosystemFooter />
      </div>
      
      <AddProductDialog open={showProductDialog} onOpenChange={setShowProductDialog} />
    </div>
  );
};

export default Ecosystem;

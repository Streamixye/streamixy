
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Image as ImageIcon } from "lucide-react";

interface CreateNFTFormProps {
  onSuccess?: () => void;
}

const CreateNFTForm: React.FC<CreateNFTFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would interact with your NFT contract
    toast({
      title: "NFT Created Successfully",
      description: `${name} has been created with a base value of 15 SYX`,
      duration: 3000,
    });
    
    setName('');
    setDescription('');
    setImageUrl('');
    
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Card className="bg-black border border-white/10">
      <CardHeader>
        <CardTitle className="text-base flex items-center">
          <ImageIcon className="h-4 w-4 mr-2 text-streamixy-primary" />
          Create NFT
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-white/70 mb-1.5 block">NFT Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter NFT name"
              required
              className="bg-transparent border-white/20"
            />
          </div>
          
          <div>
            <label className="text-sm text-white/70 mb-1.5 block">Image URL</label>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL"
              required
              className="bg-transparent border-white/20"
            />
          </div>
          
          <div>
            <label className="text-sm text-white/70 mb-1.5 block">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter NFT description"
              required
              className="bg-transparent border-white/20 min-h-[100px]"
            />
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit"
              className="bg-streamixy-primary hover:bg-streamixy-primary/80"
            >
              Create NFT (15 SYX)
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateNFTForm;

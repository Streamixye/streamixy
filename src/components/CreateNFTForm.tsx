
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Image as ImageIcon } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface CreateNFTFormProps {
  onSuccess?: () => void;
}

// Define schema for form validation
const formSchema = z.object({
  name: z.string().min(3, {
    message: "NFT name must be at least 3 characters.",
  }),
  imageUrl: z.string().url({
    message: "Please enter a valid URL.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Please enter a valid price greater than 0."
  }),
});

const CreateNFTForm: React.FC<CreateNFTFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Setup react-hook-form with zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
      description: "",
      price: "15",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Get existing NFTs from localStorage or create empty array
      const existingNFTs = JSON.parse(localStorage.getItem("createdNFTs") || "[]");
      
      // Create new NFT object
      const newNFT = {
        id: Date.now(),
        name: values.name,
        creator: "YourUsername", // This would come from auth context in a real app
        price: Number(values.price),
        previousPrice: Number(values.price) * 0.95, // Set slightly lower for display purposes
        image: values.imageUrl,
        marketCap: Number(values.price) * 100, // Simple calculation
        previousMarketCap: Number(values.price) * 95, // Slightly lower
        roi: 5, // Default ROI value
        previousRoi: 3,
        staked: 0,
        pnl: 0,
        description: values.description,
        createdAt: new Date().toISOString()
      };
      
      // Add to existing NFTs and save back to localStorage
      existingNFTs.push(newNFT);
      localStorage.setItem("createdNFTs", JSON.stringify(existingNFTs));
      
      // Show success message
      toast({
        title: "NFT Created Successfully",
        description: `${values.name} has been created with a base value of ${values.price} SYX`,
        duration: 3000,
      });
      
      // Dispatch event to notify other components
      const event = new CustomEvent('nftCreated', { 
        detail: { nft: newNFT } 
      });
      document.dispatchEvent(event);
      
      // Reset the form
      form.reset();
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating NFT:", error);
      toast({
        title: "Error Creating NFT",
        description: "There was an error creating your NFT. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-black border border-white/10 w-full">
      <CardHeader>
        <CardTitle className="text-base flex items-center text-white">
          <ImageIcon className="h-4 w-4 mr-2 text-streamixy-primary" />
          Create NFT
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-white mb-1.5 block">NFT Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter NFT name"
                      className="bg-transparent border-white/20 text-white"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-white mb-1.5 block">Image URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter image URL"
                      className="bg-transparent border-white/20 text-white"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-white mb-1.5 block">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter NFT description"
                      className="bg-transparent border-white/20 min-h-[100px] text-white"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-white mb-1.5 block">Price (SYX)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="1"
                      placeholder="Enter NFT price"
                      className="bg-transparent border-white/20 text-white"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end">
              <Button 
                type="submit"
                className="bg-streamixy-primary hover:bg-streamixy-primary/80 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create NFT"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateNFTForm;


import React from 'react';
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
});

const CreateNFTForm: React.FC<CreateNFTFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  
  // Setup react-hook-form with zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
      description: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // In a real app, this would interact with your NFT contract
    toast({
      title: "NFT Created Successfully",
      description: `${values.name} has been created with a base value of 15 SYX`,
      duration: 3000,
    });
    
    // Reset the form
    form.reset();
    
    if (onSuccess) {
      onSuccess();
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
            
            <div className="flex justify-end">
              <Button 
                type="submit"
                className="bg-streamixy-primary hover:bg-streamixy-primary/80 text-white"
              >
                Create NFT (15 SYX)
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateNFTForm;

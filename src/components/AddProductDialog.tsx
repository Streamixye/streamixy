
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  website: z.string().url({
    message: "Please enter a valid URL.",
  }),
  category: z.string().min(2, {
    message: "Please specify a category.",
  }),
});

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddProductDialog = ({ open, onOpenChange }: AddProductDialogProps) => {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      website: "",
      category: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, this would send data to your backend
    const newProduct = {
      id: Date.now().toString(),
      ...values,
    };

    // Create a custom event to notify the ProductsList component
    const event = new CustomEvent('new-product-added', { 
      detail: newProduct 
    });
    window.dispatchEvent(event);

    toast({
      title: "Project submitted!",
      description: `${values.name} has been added to the ecosystem.`,
    });

    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/80 backdrop-blur-lg border-purple-500/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">Add Your Project</DialogTitle>
          <DialogDescription className="text-gray-400">
            Submit your project to be featured in the Streamixy ecosystem.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Project Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Project name" 
                      {...field} 
                      className="bg-black/40 border-white/20 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Description</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Brief description of your project" 
                      {...field} 
                      className="bg-black/40 border-white/20 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Website URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://yourproject.com" 
                      {...field} 
                      className="bg-black/40 border-white/20 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Category</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="E.g., Analytics, Finance, Developer Tools" 
                      {...field} 
                      className="bg-black/40 border-white/20 text-white"
                    />
                  </FormControl>
                  <FormDescription className="text-gray-500">
                    Choose a category that best describes your project.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                Submit Project
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;

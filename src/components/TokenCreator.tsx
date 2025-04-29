
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const tokenFormSchema = z.object({
  tokenName: z.string().min(2, { message: "Token name must be at least 2 characters." }),
  symbol: z.string().min(2, { message: "Symbol must be at least 2 characters." }).max(5),
  initialSupply: z.string().min(1, { message: "Supply is required." }),
  decimals: z.string().regex(/^([0-9]|1[0-8])$/, { message: "Decimals must be between 0 and 18." }),
  network: z.enum(["mainnet", "testnet"], { message: "Please select a network." }),
});

type TokenFormValues = z.infer<typeof tokenFormSchema>;

const TokenCreator = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const form = useForm<TokenFormValues>({
    resolver: zodResolver(tokenFormSchema),
    defaultValues: {
      tokenName: "",
      symbol: "",
      initialSupply: "1000000",
      decimals: "18",
      network: "testnet",
    },
  });

  const onSubmit = (values: TokenFormValues) => {
    setIsCreating(true);
    
    // Simulate token creation
    setTimeout(() => {
      const tokenAddress = "0x" + Math.random().toString(16).substr(2, 40);
      
      toast({
        title: `${values.tokenName} created successfully!`,
        description: `Your ${values.network === "mainnet" ? "mainnet" : "testnet"} token has been deployed with address ${tokenAddress.substring(0, 8)}...${tokenAddress.substring(36)}`,
      });
      
      setIsCreating(false);
      form.reset();
    }, 2000);
  };

  return (
    <div className="rounded-lg border border-white/10 p-6 bg-black/20">
      <div className="mb-6">
        <h3 className="text-xl text-white font-medium mb-2">Token Creator</h3>
        <p className="text-gray-300 text-sm">Create your own ERC-20 compatible token on mainnet or testnet.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="tokenName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Token Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., My Creator Token" 
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
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Symbol</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., MCT" 
                      {...field} 
                      className="bg-black/40 border-white/20 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="initialSupply"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Initial Supply</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
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
              name="decimals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Decimals</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      className="bg-black/40 border-white/20 text-white"
                      min={0}
                      max={18}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="network"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-white">Network</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="testnet" id="testnet" />
                      <Label htmlFor="testnet" className="text-white">Testnet</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mainnet" id="mainnet" />
                      <Label htmlFor="mainnet" className="text-white">Mainnet</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            disabled={isCreating}
          >
            {isCreating ? "Creating Token..." : "Create Token"}
          </Button>
          
          <p className="text-xs text-center text-gray-500 mt-2">
            Note: Token creation on mainnet requires gas fees in your wallet.
          </p>
        </form>
      </Form>
    </div>
  );
};

export default TokenCreator;

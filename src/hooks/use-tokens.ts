
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

export interface TokenTransaction {
  amount: number;
  type: 'vote' | 'gift';
  description: string;
  creatorUsername?: string; // Add creator username for targeting specific streams
}

export const useTokens = (creatorName: string) => {
  const { toast } = useToast();
  const [tokenBalance, setTokenBalance] = useState(1000); // Mock initial balance for demo

  const handleTransaction = (transaction: TokenTransaction) => {
    if (tokenBalance < transaction.amount) {
      toast({
        title: "Insufficient Balance",
        description: `You need ${transaction.amount} SYX tokens for this ${transaction.type}`,
        variant: "destructive",
      });
      return false;
    }

    setTokenBalance(prev => prev - transaction.amount);
    toast({
      title: `${transaction.type === 'vote' ? 'Tokens Sent!' : 'Gift Sent!'}`,
      description: transaction.description,
    });
    
    // Emit a custom event with transaction details
    const event = new CustomEvent('tokenTransaction', { 
      detail: {
        ...transaction,
        creatorName,
        timestamp: new Date().toISOString(),
        affectsNftPrice: true // Flag to indicate this should affect NFT prices
      } 
    });
    document.dispatchEvent(event);
    
    return true;
  };

  // Now add a specific function for NFT staking
  const handleNftStake = (nftId: number, amount: number, description: string) => {
    if (tokenBalance < amount) {
      toast({
        title: "Insufficient Balance",
        description: `You need ${amount} SYX tokens to stake on this NFT`,
        variant: "destructive",
      });
      return false;
    }

    setTokenBalance(prev => prev - amount);
    toast({
      title: "NFT Stake Successful",
      description,
    });
    
    // Emit a custom event for NFT staking
    const event = new CustomEvent('nftStake', { 
      detail: {
        nftId,
        amount,
        creatorName, // Link the NFT to the creator
        timestamp: new Date().toISOString()
      } 
    });
    document.dispatchEvent(event);
    
    return true;
  };

  return {
    tokenBalance,
    handleTransaction,
    handleNftStake
  };
};

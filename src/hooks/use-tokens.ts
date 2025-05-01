
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
        timestamp: new Date().toISOString()
      } 
    });
    document.dispatchEvent(event);
    
    return true;
  };

  return {
    tokenBalance,
    handleTransaction
  };
};

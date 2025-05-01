
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

export interface TokenTransaction {
  amount: number;
  type: 'vote' | 'gift' | 'stake' | 'withdraw' | 'stakeNft' | 'withdrawNft';
  description: string;
  creatorUsername?: string; // Add creator username for targeting specific streams
}

export const useTokens = (creatorName: string = '') => {
  const { toast } = useToast();
  const [tokenBalance, setTokenBalance] = useState(() => {
    // Try to get balance from localStorage
    const savedBalance = localStorage.getItem('userTokenBalance');
    return savedBalance ? parseInt(savedBalance, 10) : 1000; // Default initial balance
  });

  // Save balance to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userTokenBalance', tokenBalance.toString());
  }, [tokenBalance]);

  // Subscribe to global token events
  useEffect(() => {
    const handleTokenEvent = (e: CustomEvent) => {
      const { type, amount } = e.detail;
      
      if (type === 'earn' || type === 'withdraw') {
        setTokenBalance(prev => {
          const newBalance = prev + amount;
          return newBalance;
        });
      }
    };
    
    window.addEventListener('tokenBalanceUpdate', handleTokenEvent as EventListener);
    
    return () => {
      window.removeEventListener('tokenBalanceUpdate', handleTokenEvent as EventListener);
    };
  }, []);

  const handleTransaction = (transaction: TokenTransaction) => {
    if (tokenBalance < transaction.amount && 
        (transaction.type === 'vote' || 
         transaction.type === 'gift' || 
         transaction.type === 'stake' ||
         transaction.type === 'stakeNft')) {
      toast({
        title: "Insufficient Balance",
        description: `You need ${transaction.amount} SYX tokens for this ${transaction.type}`,
        variant: "destructive",
      });
      return false;
    }

    // Update balance based on transaction type
    if (transaction.type === 'vote' || 
        transaction.type === 'gift' || 
        transaction.type === 'stake' ||
        transaction.type === 'stakeNft') {
      // Deduct tokens for spending actions
      setTokenBalance(prev => prev - transaction.amount);
      toast({
        title: `${
          transaction.type === 'vote' ? 'Tokens Sent!' : 
          transaction.type === 'gift' ? 'Gift Sent!' :
          transaction.type === 'stake' ? 'Tokens Staked!' :
          'NFT Stake Successful'
        }`,
        description: transaction.description,
      });
    } else if (transaction.type === 'withdraw' || transaction.type === 'withdrawNft') {
      // Add tokens for withdrawal actions
      setTokenBalance(prev => prev + transaction.amount);
      toast({
        title: `${transaction.type === 'withdraw' ? 'Withdrawal Successful' : 'NFT Unstake Successful'}`,
        description: transaction.description,
      });
    }
    
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

  // NFT staking function
  const handleNftStake = (nftId: number, amount: number, description: string) => {
    return handleTransaction({
      amount,
      type: 'stakeNft',
      description,
    });
  };

  // NFT unstake function
  const handleNftUnstake = (nftId: number, amount: number, description: string) => {
    return handleTransaction({
      amount,
      type: 'withdrawNft',
      description,
    });
  };

  return {
    tokenBalance,
    setTokenBalance, // Expose this for direct updates from outside
    handleTransaction,
    handleNftStake,
    handleNftUnstake
  };
};

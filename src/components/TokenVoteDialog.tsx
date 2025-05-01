
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { TokenTransaction } from "@/hooks/use-tokens";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface TokenVoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onVote: (transaction: TokenTransaction) => void;
  creatorName: string;
  tokenBalance: number;
}

const TokenVoteDialog: React.FC<TokenVoteDialogProps> = ({
  isOpen,
  onClose,
  onVote,
  creatorName,
  tokenBalance,
}) => {
  const [voteAmount, setVoteAmount] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const predefinedAmounts = [10, 50, 100, 500, 1000];
  
  // Check wallet connection on component mount and when dialog opens
  useEffect(() => {
    if (isOpen) {
      const hasWallet = localStorage.getItem('userWalletConnected') === 'true';
      if (!hasWallet) {
        toast({
          title: "Wallet Connection Required",
          description: "Please connect your wallet from the dashboard to vote tokens.",
          variant: "destructive",
        });
        
        onClose();
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      }
    }
  }, [isOpen, navigate, toast, onClose]);

  const handleVote = (amount: number) => {
    onVote({
      amount,
      type: "vote",
      description: `You voted ${amount} SYX tokens to ${creatorName}`,
      creatorUsername: creatorName.toLowerCase().replace(/\s+/g, '_')
    });
  };

  const handleCustomVote = () => {
    const amount = parseInt(voteAmount);
    if (!isNaN(amount) && amount > 0) {
      handleVote(amount);
      setVoteAmount("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="dialog-content bg-black/90 border border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Vote SYX Tokens</DialogTitle>
          <DialogDescription className="text-white/70">
            Support this creator by voting tokens
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Available Balance: {tokenBalance} SYX
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {predefinedAmounts.map((amount) => (
              <Button
                key={amount}
                className="bg-streamixy-highlight hover:bg-streamixy-highlight/80"
                onClick={() => handleVote(amount)}
                disabled={amount > tokenBalance}
              >
                {amount} SYX
              </Button>
            ))}
          </div>
          <div className="flex space-x-2 items-center mt-4">
            <Input
              type="number"
              placeholder="Custom amount"
              className="flex-1 bg-white/10 border-white/20 text-white"
              min="1"
              max={tokenBalance.toString()}
              value={voteAmount}
              onChange={(e) => setVoteAmount(e.target.value)}
            />
            <Button
              onClick={handleCustomVote}
              className="bg-streamixy-primary hover:bg-streamixy-primary/80"
            >
              Send
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TokenVoteDialog;


import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { TokenTransaction } from "@/hooks/use-tokens";

interface GiftDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGift: (transaction: TokenTransaction) => void;
  creatorName: string;
  tokenBalance: number;
}

const GiftDialog: React.FC<GiftDialogProps> = ({
  isOpen,
  onClose,
  onGift,
  creatorName,
  tokenBalance,
}) => {
  const giftItems = [
    { id: 1, name: "Flower", value: 5, emoji: "🌹" },
    { id: 2, name: "Lion", value: 50, emoji: "🦁" },
    { id: 3, name: "Crown", value: 100, emoji: "👑" },
    { id: 4, name: "Diamond", value: 500, emoji: "💎" },
  ];

  const handleGift = (gift: typeof giftItems[0]) => {
    onGift({
      amount: gift.value,
      type: "gift",
      description: `You gifted a ${gift.name} (${gift.value} SYX) to ${creatorName}`,
      creatorUsername: creatorName.toLowerCase().replace(/\s+/g, '_')
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="dialog-content bg-black/90 border border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Send Gifts</DialogTitle>
          <DialogDescription className="text-white/70">
            Show your appreciation with gifts
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Available Balance: {tokenBalance} SYX
          </p>
          <div className="grid grid-cols-2 gap-3">
            {giftItems.map((gift) => (
              <Button
                key={gift.id}
                variant="outline"
                className="h-auto flex flex-col p-4 items-center bg-transparent border border-white/20 text-white hover:bg-white/10"
                onClick={() => handleGift(gift)}
                disabled={gift.value > tokenBalance}
              >
                <span className="text-3xl mb-2">{gift.emoji}</span>
                <span className="text-sm">{gift.name}</span>
                <span className="text-xs text-muted-foreground mt-1">
                  {gift.value} SYX
                </span>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GiftDialog;


import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

interface Creator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  followers: number;
}

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOCK_CREATORS: Creator[] = [
  {
    id: "1",
    name: "CryptoCreator",
    username: "crypto_creator",
    avatar: "https://i.pravatar.cc/150?img=1",
    followers: 24500,
  },
  {
    id: "2",
    name: "ArtisticSoul",
    username: "artistic_soul",
    avatar: "https://i.pravatar.cc/150?img=5",
    followers: 18900,
  },
  {
    id: "3",
    name: "BeatMaker",
    username: "beat_maker",
    avatar: "https://i.pravatar.cc/150?img=8",
    followers: 12300,
  },
];

const SearchDialog: React.FC<SearchDialogProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  const filteredCreators = MOCK_CREATORS.filter(creator =>
    creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    creator.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreatorClick = (username: string) => {
    navigate(`/creator/${username}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/90 border border-white/10 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Search Creators</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          <Input
            type="text"
            placeholder="Search creators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
          <div className="space-y-2">
            {filteredCreators.map((creator) => (
              <Button
                key={creator.id}
                variant="ghost"
                className="w-full justify-start text-left hover:bg-white/10"
                onClick={() => handleCreatorClick(creator.username)}
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={creator.avatar} alt={creator.name} />
                    <AvatarFallback>{creator.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{creator.name}</p>
                    <p className="text-sm text-white/70">@{creator.username}</p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;

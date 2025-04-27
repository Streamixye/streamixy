
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";

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
  {
    id: "4",
    name: "ChefMaster",
    username: "chef_master",
    avatar: "https://i.pravatar.cc/150?img=4",
    followers: 45200,
  },
  {
    id: "5",
    name: "YogaGuru",
    username: "yoga_guru",
    avatar: "https://i.pravatar.cc/150?img=9",
    followers: 32100,
  }
];

const SearchDialog: React.FC<SearchDialogProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const navigate = useNavigate();
  
  const filteredCreators = MOCK_CREATORS.filter(creator =>
    creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    creator.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreatorClick = (username: string) => {
    navigate(`/creator/${username}`);
    onClose();
  };

  // Auto-focus the search input when the dialog opens
  useEffect(() => {
    if (isOpen) {
      const timeout = setTimeout(() => {
        const input = document.getElementById('search-input');
        if (input) {
          input.focus();
        }
      }, 100);
      
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  // Reset search when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setInputFocused(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/90 border border-white/10 text-white sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between border-b border-white/10 pb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
            <Input
              id="search-input"
              type="text"
              placeholder="Search creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setInputFocused(true)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pl-10"
              autoFocus
            />
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button
            variant="ghost"
            className="ml-2 text-white/70 hover:text-white p-2 h-auto"
            onClick={onClose}
          >
            Cancel
          </Button>
        </DialogHeader>
        
        <div className="space-y-2 pt-2">
          {searchQuery === "" && !inputFocused ? (
            <div className="text-center py-8 text-white/50">
              <Search className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>Search for creators</p>
            </div>
          ) : filteredCreators.length > 0 ? (
            filteredCreators.map((creator) => (
              <Button
                key={creator.id}
                variant="ghost"
                className="w-full justify-start text-left hover:bg-white/10 py-3"
                onClick={() => handleCreatorClick(creator.username)}
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={creator.avatar} alt={creator.name} />
                    <AvatarFallback>{creator.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-base">{creator.name}</p>
                    <p className="text-sm text-white/70">@{creator.username}</p>
                    <p className="text-xs text-white/50">{creator.followers.toLocaleString()} followers</p>
                  </div>
                </div>
              </Button>
            ))
          ) : (
            <div className="text-center py-8 text-white/50">
              <p>No creators found</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;

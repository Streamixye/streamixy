
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
import { Search, X, UserSearch } from "lucide-react";

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

// Extended mock creators list to provide more search results
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
  },
  {
    id: "6",
    name: "TechWizard",
    username: "tech_wizard",
    avatar: "https://i.pravatar.cc/150?img=12",
    followers: 28700,
  },
  {
    id: "7",
    name: "FashionIcon",
    username: "fashion_icon",
    avatar: "https://i.pravatar.cc/150?img=20",
    followers: 37500,
  },
  {
    id: "8",
    name: "TravelExplorer",
    username: "travel_explorer",
    avatar: "https://i.pravatar.cc/150?img=25",
    followers: 19800,
  },
  {
    id: "9",
    name: "GamingPro",
    username: "gaming_pro",
    avatar: "https://i.pravatar.cc/150?img=30",
    followers: 41300,
  },
  {
    id: "10",
    name: "FitnessCoach",
    username: "fitness_coach",
    avatar: "https://i.pravatar.cc/150?img=33",
    followers: 27400,
  },
  {
    id: "11",
    name: "DigitalArtist",
    username: "digital_artist",
    avatar: "https://i.pravatar.cc/150?img=35",
    followers: 15600,
  },
  {
    id: "12",
    name: "MusicProducer",
    username: "music_producer",
    avatar: "https://i.pravatar.cc/150?img=40",
    followers: 29300,
  }
];

const SearchDialog: React.FC<SearchDialogProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  
  // Filter creators based on search query with more intelligent matching
  const filteredCreators = MOCK_CREATORS.filter(creator =>
    creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    creator.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get suggested creators based on search query
  // This shows suggestions even with partial matches at the start of the name or username
  const getSuggestedCreators = () => {
    if (!searchQuery.trim()) return [];
    
    // First find exact matches or matches at the start of name/username
    const primaryMatches = MOCK_CREATORS.filter(creator =>
      creator.name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
      creator.username.toLowerCase().startsWith(searchQuery.toLowerCase())
    );
    
    // Then find matches anywhere in the name/username
    const secondaryMatches = MOCK_CREATORS.filter(creator => 
      (creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       creator.username.toLowerCase().includes(searchQuery.toLowerCase())) &&
      !primaryMatches.some(match => match.id === creator.id)
    );
    
    // Combine both types of matches with primary matches first
    return [...primaryMatches, ...secondaryMatches].slice(0, 5); // Limit to 5 suggestions
  };
  
  const suggestedCreators = getSuggestedCreators();

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
      setShowSuggestions(false);
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
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
              }}
              onFocus={() => {
                setInputFocused(true);
                if (searchQuery.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pl-10"
              autoFocus
            />
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50"
                onClick={() => {
                  setSearchQuery("");
                  setShowSuggestions(false);
                }}
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
          {/* Show suggestions as user types */}
          {showSuggestions && suggestedCreators.length > 0 && (
            <div className="bg-black/95 border border-white/10 rounded-md mb-2">
              <div className="p-2 border-b border-white/10 flex items-center">
                <UserSearch className="h-4 w-4 mr-2 text-purple-400" />
                <span className="text-sm text-white/70">Suggested Creators</span>
              </div>
              <div className="py-1">
                {suggestedCreators.map((creator) => (
                  <Button
                    key={creator.id}
                    variant="ghost"
                    className="w-full justify-start text-left hover:bg-white/10 py-2"
                    onClick={() => handleCreatorClick(creator.username)}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={creator.avatar} alt={creator.name} />
                        <AvatarFallback>{creator.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{creator.name}</p>
                        <p className="text-xs text-white/70">@{creator.username}</p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Main search results */}
          {searchQuery === "" && !inputFocused ? (
            <div className="text-center py-8 text-white/50">
              <Search className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>Search for creators</p>
            </div>
          ) : filteredCreators.length > 0 ? (
            <>
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-sm text-white/70">Search Results</span>
                <span className="text-xs text-white/50">{filteredCreators.length} found</span>
              </div>
              {filteredCreators.map((creator) => (
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
              ))}
            </>
          ) : (
            <div className="text-center py-8 text-white/50">
              <p>No creators found</p>
              <p className="text-sm mt-1">Try another search term</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;

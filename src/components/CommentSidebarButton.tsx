
import React, { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { 
  Sidebar, 
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface CommentSidebarButtonProps {
  onComment?: (comment: string) => void;
}

const CommentSidebarButton: React.FC<CommentSidebarButtonProps> = ({ onComment }) => {
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentCounter, setCommentCounter] = useState(0);

  const handleCommentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCommentOpen(prev => !prev);
  };

  const handleSubmitComment = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!commentText.trim()) return;
    
    if (onComment) {
      onComment(commentText);
    }
    
    setCommentCounter(prev => prev + 1);
    
    // Clear the input field and close the comment panel
    setCommentText("");
    setIsCommentOpen(false);
  };

  // Add a handler for the Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      
      if (!commentText.trim()) return;
      
      if (onComment) {
        onComment(commentText);
      }
      
      setCommentCounter(prev => prev + 1);
      
      setCommentText("");
      setIsCommentOpen(false);
    }
  };

  return (
    <>
      <Sidebar side="left" variant="inset">
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleCommentClick}
                tooltip="Add Comment"
                className="hover:bg-purple-500/20"
              >
                <MessageCircle className="text-purple-500" />
                <span>Comment</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      {isCommentOpen && (
        <div 
          className="fixed bottom-24 left-16 z-50 bg-black/90 p-4 rounded-lg border border-white/10 w-72"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          data-prevent-scroll="true"
        >
          <h3 className="text-lg font-semibold mb-2">Add a comment</h3>
          <div className="flex items-center space-x-2">
            <Textarea 
              placeholder="Share your thoughts..." 
              className="bg-transparent border-white/20 flex-1"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={handleKeyDown}
              data-prevent-scroll="true"
              autoFocus
            />
            <Button 
              onClick={handleSubmitComment}
              className="bg-purple-500 hover:bg-purple-600 h-10"
              disabled={!commentText.trim()}
              data-prevent-scroll="true"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default CommentSidebarButton;


import React, { useState } from "react";
import { MessageCircle } from "lucide-react";
import { 
  Sidebar, 
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface CommentAnimation {
  id: number;
  x: number;
  y: number;
}

interface CommentSidebarButtonProps {
  onComment?: (comment: string) => void;
}

const CommentSidebarButton: React.FC<CommentSidebarButtonProps> = ({ onComment }) => {
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const { toast } = useToast();
  const [commentCounter, setCommentCounter] = useState(0);

  const handleCommentClick = () => {
    setIsCommentOpen(prev => !prev);
  };

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    
    if (onComment) {
      onComment(commentText);
    }
    
    setCommentCounter(prev => prev + 1);
    
    // Show a toast message every 5th comment
    if (commentCounter % 5 === 0 && commentCounter > 0) {
      toast({
        title: "Comment shared!",
        description: `You've shared ${commentCounter + 1} comments!`,
      });
    }
    
    // Clear the input field and close the comment panel
    setCommentText("");
    setIsCommentOpen(false);
  };

  // Add a handler for the Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
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
          <Textarea 
            placeholder="Share your thoughts..." 
            className="bg-transparent border-white/20 mb-2"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={handleKeyDown}
            data-prevent-scroll="true"
          />
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsCommentOpen(false)}
              className="text-white border-white/20"
              data-prevent-scroll="true"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitComment}
              className="bg-purple-500 hover:bg-purple-600"
              data-prevent-scroll="true"
            >
              Comment
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default CommentSidebarButton;

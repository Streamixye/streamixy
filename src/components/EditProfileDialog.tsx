
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageIcon } from "lucide-react";

interface EditProfileDialogProps {
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  profile: {
    nickname: string;
    avatar: string;
  };
  onSave: (profile: { nickname: string; avatar: string }) => void;
}

const EditProfileDialog = ({
  children,
  isOpen,
  onOpenChange,
  profile,
  onSave,
}: EditProfileDialogProps) => {
  const [editProfile, setEditProfile] = useState({
    nickname: profile.nickname,
    avatar: profile.avatar,
  });

  // Reset state when dialog opens or profile changes
  useEffect(() => {
    if (isOpen) {
      setEditProfile({
        nickname: profile.nickname,
        avatar: profile.avatar,
      });
    }
  }, [isOpen, profile]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setEditProfile({
            ...editProfile,
            avatar: event.target.result.toString(),
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = () => {
    onSave(editProfile);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <div>{children}</div>
      <DialogContent className="bg-black border border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription className="text-white">
            Update your profile information
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={editProfile.avatar} alt={editProfile.nickname} />
              <AvatarFallback className="bg-streamixy-primary/20 text-streamixy-primary text-xl">
                {editProfile.nickname.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <label htmlFor="avatar-upload">
              <Button
                variant="outline"
                size="sm"
                className="text-xs bg-black border-white/20 text-white hover:bg-black/80"
                type="button"
                onClick={() => document.getElementById("avatar-upload")?.click()}
              >
                <ImageIcon className="h-3 w-3 mr-1" />
                Upload Photo
              </Button>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>
          <div className="space-y-2">
            <label htmlFor="nickname" className="text-sm text-white">
              Nickname
            </label>
            <Input
              id="nickname"
              value={editProfile.nickname}
              onChange={(e) =>
                setEditProfile({ ...editProfile, nickname: e.target.value })
              }
              className="bg-transparent border-white/20 text-white"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-black border-white/20 text-white hover:bg-black/80"
            >
              Cancel
            </Button>
            <Button
              onClick={saveProfile}
              className="bg-streamixy-primary hover:bg-streamixy-primary/80 text-white"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;

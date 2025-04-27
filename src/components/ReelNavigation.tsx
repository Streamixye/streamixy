
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";

interface ReelNavigationProps {
  onNext: () => void;
  onPrevious: () => void;
}

const ReelNavigation: React.FC<ReelNavigationProps> = ({
  onNext,
  onPrevious,
}) => {
  return (
    <div className="fixed right-6 bottom-1/2 transform translate-y-1/2 flex flex-col space-y-4 z-40">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-streamixy-dark/40 hover:bg-streamixy-primary/40"
        onClick={onPrevious}
      >
        <ChevronUp className="h-6 w-6 text-white" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-streamixy-dark/40 hover:bg-streamixy-primary/40"
        onClick={onNext}
      >
        <ChevronDown className="h-6 w-6 text-white" />
      </Button>
    </div>
  );
};

export default ReelNavigation;

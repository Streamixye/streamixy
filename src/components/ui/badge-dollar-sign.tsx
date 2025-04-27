
import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BadgeDollarSignProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

const BadgeDollarSign = React.forwardRef<
  HTMLDivElement,
  BadgeDollarSignProps
>(({ className, ...props }, ref) => {
  return (
    <Badge className={cn("flex items-center", className)}>
      <DollarSign className="h-4 w-4" />
    </Badge>
  )
})
BadgeDollarSign.displayName = "BadgeDollarSign"

export { BadgeDollarSign }


import * as React from "react"
import { BadgeProps, Badge } from "@/components/ui/badge"
import { DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BadgeDollarSignProps extends BadgeProps {
  className?: string
}

const BadgeDollarSign = React.forwardRef<
  HTMLDivElement,
  BadgeDollarSignProps
>(({ className, ...props }, ref) => {
  return (
    <Badge ref={ref} className={cn("flex items-center", className)} {...props}>
      <DollarSign className="h-4 w-4" />
    </Badge>
  )
})
BadgeDollarSign.displayName = "BadgeDollarSign"

export { BadgeDollarSign }

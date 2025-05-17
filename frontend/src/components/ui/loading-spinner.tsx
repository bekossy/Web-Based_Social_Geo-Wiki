import * as React from "react"
import {Loader2} from "lucide-react"
import {cn} from "@/lib/utils"

interface LoadingSpinnerProps extends React.SVGProps<SVGSVGElement> {
    size?: number
    className?: string
}

const LoadingSpinner = ({size = 24, className, ...props}: LoadingSpinnerProps) => {
    return (
        <Loader2
            width={size}
            height={size}
            className={cn("animate-spin text-primary", className)}
            {...props}
        />
    )
}

export default LoadingSpinner

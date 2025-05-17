import React from "react"
import {cn} from "@/lib/utils"

interface EmptyStateProps {
    title: string
    description?: string
    icon?: React.ReactNode
    className?: string
}

const EmptyState = ({title, description, icon, className}: EmptyStateProps) => {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center h-full p-6 text-center",
                className,
            )}
        >
            {icon}
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
    )
}

export default EmptyState

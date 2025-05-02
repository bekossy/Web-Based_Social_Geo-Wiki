import React from "react"

interface EmptyStateProps {
    title: string
    description?: string
    icon?: React.ReactNode
}

const EmptyState = ({title, description, icon}: EmptyStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            {icon}
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
    )
}

export default EmptyState

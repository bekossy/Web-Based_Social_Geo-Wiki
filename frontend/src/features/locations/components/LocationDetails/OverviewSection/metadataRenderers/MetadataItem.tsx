import React from "react"

interface MetadataItemProps {
    icon: React.ElementType
    label: string
    children: React.ReactNode
}

export const MetadataItem = ({icon: Icon, label, children}: MetadataItemProps) => (
    <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
        <div>
            <p className="font-medium">{label}</p>
            <div className="text-sm text-muted-foreground">{children}</div>
        </div>
    </div>
)

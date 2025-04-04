import React from "react"
import {Skeleton} from "./ui/skeleton"

const LocationDetailsSkeleton = () => (
    <div className="flex flex-col h-full">
        <Skeleton className="aspect-video w-full" />
        <div className="p-4">
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="p-4 space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        </div>
    </div>
)

export default LocationDetailsSkeleton

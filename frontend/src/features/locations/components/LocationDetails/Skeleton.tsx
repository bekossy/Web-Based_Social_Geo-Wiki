import {Skeleton as CnSkeleton} from "@/components/ui/skeleton"
import React from "react"

const Skeleton = () => {
    return (
        <div className="flex flex-col h-full">
            <CnSkeleton className="aspect-video w-full" />
            <div className="p-4">
                <CnSkeleton className="h-8 w-3/4 mb-2" />
                <CnSkeleton className="h-4 w-1/2" />
            </div>
            <div className="p-4 space-y-4">
                <CnSkeleton className="h-10 w-full" />
                <div className="space-y-2">
                    <CnSkeleton className="h-4 w-full" />
                    <CnSkeleton className="h-4 w-3/4" />
                    <CnSkeleton className="h-4 w-1/2" />
                </div>
            </div>
        </div>
    )
}

export default Skeleton

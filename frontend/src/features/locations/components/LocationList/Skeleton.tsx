import {Skeleton as CnSkeleton} from "@/components/ui/skeleton"
import React from "react"

const Skeleton = () => {
    return (
        <div className="flex flex-col gap-4 p-4">
            <CnSkeleton className="h-[200px] w-full rounded-lg" />
            <CnSkeleton className="h-[200px] w-full rounded-lg" />
            <CnSkeleton className="h-[200px] w-full rounded-lg" />
        </div>
    )
}

export default Skeleton

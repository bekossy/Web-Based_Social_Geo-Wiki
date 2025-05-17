"use client"

import {cn} from "@/lib/utils"
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet"
import LoadingSpinner from "../ui/loading-spinner"

type SidebarProps = {
    title: string
    description?: string
    open: boolean
    sidebarContent: React.ReactNode
    handleOnOpenChange: (open: boolean) => void
    isLoading: boolean
    showCloseButton?: boolean
} & React.ComponentProps<typeof SheetContent>

const Sidebar = ({
    title,
    description,
    open,
    sidebarContent: children,
    handleOnOpenChange,
    isLoading,
    showCloseButton = true,
    ...props
}: SidebarProps) => {
    return (
        <Sheet open={open} onOpenChange={handleOnOpenChange}>
            <SheetContent
                closeButton={showCloseButton}
                className={cn("flex flex-col p-4 min-w-[400px]", props.className)}
                {...props}
            >
                <SheetHeader className="invisible">
                    <SheetTitle>{title}</SheetTitle>
                    <SheetDescription>{description}</SheetDescription>
                </SheetHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <LoadingSpinner size={32} className="text-muted-foreground" />
                    </div>
                ) : (
                    <div className="[&::-webkit-scrollbar]:w-0 overflow-auto h-full">
                        {children}
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}

export default Sidebar

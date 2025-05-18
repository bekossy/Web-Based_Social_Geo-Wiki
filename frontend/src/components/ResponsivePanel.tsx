import {Drawer, DrawerContent, DrawerHeader, DrawerTitle} from "@/components/ui/drawer"
import Sidebar from "@/components/layout/Sidebar"
import {useMediaQuery} from "@/hooks/use-media-query"

type Props = {
    open: boolean
    onOpenChange: (val: boolean) => void
    title?: string
    content: React.ReactNode
    isLoading: boolean
    side?: "left" | "right"
    className?: string
}

const ResponsivePanel = ({
    open,
    onOpenChange,
    title = "",
    content,
    isLoading,
    side = "right",
    className = "",
}: Props) => {
    const isDesktop = useMediaQuery("(min-width: 550px)")

    if (isDesktop) {
        return (
            <Sidebar
                open={open}
                handleOnOpenChange={onOpenChange}
                title={title}
                sidebarContent={content}
                isLoading={isLoading}
                side={side}
                className={className}
            />
        )
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="max-h-[75vh] h-[75vh] p-4">
                <DrawerHeader className="invisible p-0">
                    <DrawerTitle>{title}</DrawerTitle>
                </DrawerHeader>
                <div className="[&::-webkit-scrollbar]:w-0 overflow-auto h-full">{content}</div>
            </DrawerContent>
        </Drawer>
    )
}

export default ResponsivePanel

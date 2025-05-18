import {Menu} from "lucide-react"
import {Dispatch, SetStateAction} from "react"
import Link from "next/link"
import {cn} from "@/lib/utils"

interface NavbarProps {
    setIsNavSidebarOpen: Dispatch<SetStateAction<boolean>>
    isDesktop: boolean
}

const Navbar = ({setIsNavSidebarOpen, isDesktop}: NavbarProps) => {
    return (
        <nav className="fixed top-0 h-[60px] md:h-[70px] left-0 bg-white w-full z-50">
            <div className="max-w-container w-full my-0 mx-auto px-2 md:px-4 flex gap-2 items-center h-full">
                <Menu className="cursor-pointer" onClick={() => setIsNavSidebarOpen(true)} />
                <Link
                    href={"/"}
                    className={cn(
                        "text-xl md:text-3xl font-semibold w-full",
                        isDesktop ? "" : "text-center",
                    )}
                >
                    Social Geo-Wiki
                </Link>
            </div>
        </nav>
    )
}

export default Navbar

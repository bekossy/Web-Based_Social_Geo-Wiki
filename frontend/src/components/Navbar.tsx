"use client"

import {Menu} from "lucide-react"

const Navbar = () => {
    return (
        <nav className="fixed top-0 h-[60px] md:h-[70px] left-0 bg-white w-full z-10">
            <div className="max-w-container w-full my-0 mx-auto px-2 md:px-4 flex gap-2 items-center h-full">
                <Menu className="cursor-pointer" />
                <h1 className="text-xl md:text-3xl font-semibold">Social Geo-Wiki</h1>
            </div>
        </nav>
    )
}

export default Navbar

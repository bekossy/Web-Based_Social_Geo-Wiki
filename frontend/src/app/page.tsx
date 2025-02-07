"use client"

// import LocationDetails from "@/components/LocationDetails"
import LocationList from "@/components/LocationList"
import MapControlPanel from "@/components/MapControlPanel"
import MapView from "@/components/MapView"
import Sidebar from "@/components/Sidebar"
import {useRef, useState} from "react"
import {type MapRef} from "react-map-gl"

export default function Home() {
    const mapRef = useRef<MapRef>(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    return (
        <main className="h-screen w-full relative">
            <div className="max-w-[800px] my-0 mx-auto w-full absolute z-10 top-[80px] right-0 left-0 px-4 flex gap-4">
                <MapControlPanel mapRef={mapRef} setIsDrawerOpen={setIsDrawerOpen} />
            </div>

            <MapView mapRef={mapRef} />

            <Sidebar
                open={isDrawerOpen}
                handleOnOpenChange={setIsDrawerOpen}
                title="Title"
                sidebarContent={<LocationList />}
            />
        </main>
    )
}

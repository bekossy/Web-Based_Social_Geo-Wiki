"use client"

import MapControlPanel from "@/components/MapControlPanel"
import MapView from "@/components/MapView"
import Sidebar from "@/components/Sidebar"
import {type SearchBoxRetrieveResponse} from "@mapbox/search-js-core"
import dynamic from "next/dynamic"
import {useRef, useState} from "react"
import {type MapRef} from "react-map-gl"

const LocationDetails = dynamic(() => import("@/components/LocationDetails"), {ssr: false})
const LocationList = dynamic(() => import("@/components/LocationList"), {ssr: false})

export default function Home() {
    const mapRef = useRef<MapRef>(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isLoadingLocationInfo, setIsLoadingLocationInfo] = useState(false)
    const [locationFeatureInfo, setLocationFeatureInfo] = useState<
        SearchBoxRetrieveResponse["features"]
    >([])

    return (
        <main className="h-screen w-full relative">
            <div className="max-w-[800px] my-0 mx-auto w-full absolute z-10 top-[80px] right-0 left-0 px-4 flex gap-2">
                <MapControlPanel
                    mapRef={mapRef}
                    setIsDrawerOpen={setIsDrawerOpen}
                    setIsLoadingLocationInfo={setIsLoadingLocationInfo}
                    setLocationFeatureInfo={setLocationFeatureInfo}
                />
            </div>

            <MapView
                mapRef={mapRef}
                setLocationFeatureInfo={setLocationFeatureInfo}
                setIsDrawerOpen={setIsDrawerOpen}
            />

            <Sidebar
                open={isDrawerOpen}
                handleOnOpenChange={setIsDrawerOpen}
                title="Title"
                sidebarContent={
                    locationFeatureInfo.length > 1 ? (
                        <LocationList
                            locationFeatureInfo={locationFeatureInfo}
                            setIsLoadingLocationInfo={setIsLoadingLocationInfo}
                            mapRef={mapRef}
                            setIsDrawerOpen={setIsDrawerOpen}
                            setLocationFeatureInfo={setLocationFeatureInfo}
                        />
                    ) : (
                        <LocationDetails locationFeatureInfo={locationFeatureInfo[0]} />
                    )
                }
                isLoading={isLoadingLocationInfo}
            />
        </main>
    )
}

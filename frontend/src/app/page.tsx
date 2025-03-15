"use client"

import LocationDetails from "@/components/LocationDetails"
import LocationList from "@/components/LocationList"
import MapControlPanel from "@/components/MapControlPanel"
import MapView from "@/components/MapView"
import Navbar from "@/components/Navbar"
import {NavigationSidebar} from "@/components/NavigationSidebar"
import ProtectedRoute from "@/components/ProtectedRoute"
import Sidebar from "@/components/Sidebar"
import {fetchAllCategoryList} from "@/services/mapbox"
import {type CategoryListResponse} from "@/services/mapbox/types"
import {getAllMappins} from "@/services/mappins"
import {Mappins} from "@/services/mappins/types"
import {type SearchBoxRetrieveResponse} from "@mapbox/search-js-core"
import {useCallback, useEffect, useRef, useState} from "react"
import {type MapRef} from "react-map-gl"

export default function Home() {
    const mapRef = useRef<MapRef>(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isNavSidebarOpen, setIsNavSidebarOpen] = useState(false)
    const [isLoadingLocationInfo, setIsLoadingLocationInfo] = useState(false)
    const [locationFeatureInfo, setLocationFeatureInfo] = useState<
        SearchBoxRetrieveResponse["features"]
    >([])
    const [categoryList, setCategoryList] = useState<CategoryListResponse[]>([])
    const [mappins, setMappins] = useState<Mappins[]>([])
    const [selectedMappinLocation, setSelectedMappinLocation] = useState<Mappins | undefined>(
        undefined
    )

    const fetchAllMappins = useCallback(async () => {
        try {
            const data = await getAllMappins()
            setMappins(data)
        } catch (error) {
            console.error(error)
        }
    }, [])

    useEffect(() => {
        fetchAllMappins()
    }, [fetchAllMappins])

    const fetchCategoryList = useCallback(async () => {
        try {
            const data = await fetchAllCategoryList()
            setCategoryList(data.list_items)
        } catch (error) {
            console.error(error)
        }
    }, [])

    useEffect(() => {
        fetchCategoryList()
    }, [fetchCategoryList])

    useEffect(() => {
        if (locationFeatureInfo.length === 1) {
            const isPinned = mappins.find(
                (pin) => pin.mapboxId === locationFeatureInfo[0].properties.mapbox_id
            )
            setSelectedMappinLocation(isPinned)
        }
    }, [locationFeatureInfo, mappins])

    return (
        <ProtectedRoute>
            <Navbar setIsNavSidebarOpen={setIsNavSidebarOpen} />
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
                    mappins={mappins}
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
                            <LocationDetails
                                locationFeatureInfo={locationFeatureInfo[0]}
                                selectedMappinLocation={selectedMappinLocation}
                                fetchAllMappins={fetchAllMappins}
                            />
                        )
                    }
                    isLoading={isLoadingLocationInfo}
                />

                <Sidebar
                    open={isNavSidebarOpen}
                    side={"left"}
                    handleOnOpenChange={setIsNavSidebarOpen}
                    title=""
                    sidebarContent={
                        <NavigationSidebar
                            setLocationFeatureInfo={setLocationFeatureInfo}
                            setIsNavSidebarOpen={setIsNavSidebarOpen}
                            setIsDrawerOpen={setIsDrawerOpen}
                            categoryList={categoryList}
                        />
                    }
                    isLoading={false}
                    className="p-0 block"
                />
            </main>
        </ProtectedRoute>
    )
}

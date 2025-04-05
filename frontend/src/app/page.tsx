"use client"

import {useCallback, useEffect, useRef, useState} from "react"
import {type MapRef} from "react-map-gl"
import {type SearchBoxRetrieveResponse} from "@mapbox/search-js-core"

import MapControlPanel from "@/features/map/components/MapControlPanel"

import Navbar from "@/components/layout/Navbar"
import {NavigationSidebar} from "@/components/NavigationSidebar"
import ProtectedRoute from "@/components/ProtectedRoute"
import Sidebar from "@/components/layout/Sidebar"
import {useMediaQuery} from "@/hooks/use-media-query"
import {getAllMappinPosts} from "@/services/posts"
import {MappinPosts} from "@/services/posts/types"
import {fetchAllCategoryList} from "@/services/mapbox"
import {type CategoryListResponse} from "@/services/mapbox/types"
import {getAllMappins} from "@/services/mappins"
import {Mappins} from "@/services/mappins/types"
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import {v4 as uuidv4} from "uuid"
import LocationNotFound from "@/features/locations/components/LocationNotFound"
import MapView from "@/features/map/components/MapView"
import LocationList from "@/features/locations/components/LocationList"
import UserAvatar from "@/components/UserAvatar"
import {useAuth} from "@/contexts/AuthContext"
import LocationDetails from "@/features/locations/components/LocationDetails"

export default function Home() {
    const mapRef = useRef<MapRef>(null)
    const isDesktop = useMediaQuery("(min-width: 550px)")
    const {user} = useAuth()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isNavSidebarOpen, setIsNavSidebarOpen] = useState(false)
    const [isLoadingLocationInfo, setIsLoadingLocationInfo] = useState(false)
    const [sessionToken, setSessionToken] = useState(() => uuidv4())

    const [locationFeatureInfo, setLocationFeatureInfo] = useState<
        SearchBoxRetrieveResponse["features"]
    >([])
    const [categoryList, setCategoryList] = useState<CategoryListResponse[]>([])
    const [mappins, setMappins] = useState<Mappins[]>([])
    const [selectedMappinLocation, setSelectedMappinLocation] = useState<Mappins | undefined>()
    const [selectedMappinPosts, setSelectedMappinPosts] = useState<MappinPosts[]>([])

    const fetchMappins = useCallback(async () => {
        try {
            const data = await getAllMappins()
            setMappins(data)
        } catch (error) {
            console.error("Failed to fetch mappins:", error)
        }
    }, [])

    useEffect(() => {
        fetchMappins()
    }, [fetchMappins])

    const fetchListOfCategories = useCallback(async () => {
        try {
            const data = await fetchAllCategoryList()
            setCategoryList(data.listItems)
        } catch (error) {
            console.error("Failed to fetch list of categories:", error)
        }
    }, [])

    useEffect(() => {
        fetchListOfCategories()
    }, [fetchListOfCategories])

    useEffect(() => {
        if (locationFeatureInfo.length === 1) {
            const activeMappin = mappins.find(
                (pin) => pin.mapboxId === locationFeatureInfo[0].properties.mapbox_id
            )
            setSelectedMappinLocation(activeMappin)
        }
    }, [locationFeatureInfo, mappins])

    const fetchMappinPosts = useCallback(async () => {
        if (!selectedMappinLocation) return

        try {
            const data = await getAllMappinPosts({mappinId: selectedMappinLocation._id})
            setSelectedMappinPosts(data)
        } catch (error) {
            console.error("Failed to fetch mappin posts:", error)
        }
    }, [selectedMappinLocation])

    useEffect(() => {
        fetchMappinPosts()
    }, [fetchMappinPosts])

    return (
        <ProtectedRoute>
            <Navbar setIsNavSidebarOpen={setIsNavSidebarOpen} />
            <main className="h-screen w-full relative">
                <div className="max-w-[800px] my-0 mx-auto w-full absolute z-10 top-[80px] right-0 left-0 px-4 flex gap-2">
                    <MapControlPanel
                        mapRef={mapRef}
                        setIsLoadingLocationInfo={setIsLoadingLocationInfo}
                        setLocationFeatureInfo={setLocationFeatureInfo}
                        setIsDrawerOpen={setIsDrawerOpen}
                        sessionToken={sessionToken}
                        setSessionToken={setSessionToken}
                    />

                    <UserAvatar color={user?.color || ""} username={user?.username || ""} />
                </div>

                <MapView
                    mapRef={mapRef}
                    setLocationFeatureInfo={setLocationFeatureInfo}
                    setIsDrawerOpen={setIsDrawerOpen}
                    setIsLoadingLocationInfo={setIsLoadingLocationInfo}
                    sessionToken={sessionToken}
                    mappins={mappins}
                />

                {isDesktop ? (
                    <Sidebar
                        open={isDrawerOpen}
                        handleOnOpenChange={setIsDrawerOpen}
                        title="Title"
                        sidebarContent={
                            locationFeatureInfo.length === 0 ? (
                                <LocationNotFound />
                            ) : locationFeatureInfo.length > 1 ? (
                                <LocationList
                                    locationFeatureInfo={locationFeatureInfo}
                                    setIsLoadingLocationInfo={setIsLoadingLocationInfo}
                                    setLocationFeatureInfo={setLocationFeatureInfo}
                                    mapRef={mapRef}
                                    sessionToken={sessionToken}
                                />
                            ) : (
                                <LocationDetails
                                    locationFeatureInfo={locationFeatureInfo[0]}
                                    selectedMappinLocation={selectedMappinLocation}
                                    fetchAllMappins={fetchMappins}
                                    selectedMappinPosts={selectedMappinPosts}
                                    fetchSelectedMappinPosts={fetchMappinPosts}
                                />
                            )
                        }
                        isLoading={isLoadingLocationInfo}
                    />
                ) : (
                    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                        <DrawerContent className="p-4 max-h-[75vh] h-[75vh]">
                            <div className="[&::-webkit-scrollbar]:w-0 overflow-auto h-full">
                                <DrawerHeader className="hidden">
                                    <DrawerTitle>Move Goal</DrawerTitle>
                                    <DrawerDescription>
                                        Set your daily activity goal.
                                    </DrawerDescription>
                                </DrawerHeader>
                                {locationFeatureInfo.length === 0 ? (
                                    <LocationNotFound />
                                ) : locationFeatureInfo.length > 1 ? (
                                    <LocationList
                                        locationFeatureInfo={locationFeatureInfo}
                                        setIsLoadingLocationInfo={setIsLoadingLocationInfo}
                                        setLocationFeatureInfo={setLocationFeatureInfo}
                                        mapRef={mapRef}
                                        sessionToken={sessionToken}
                                    />
                                ) : (
                                    <LocationDetails
                                        locationFeatureInfo={locationFeatureInfo[0]}
                                        selectedMappinLocation={selectedMappinLocation}
                                        fetchAllMappins={fetchMappins}
                                        selectedMappinPosts={selectedMappinPosts}
                                        fetchSelectedMappinPosts={fetchMappinPosts}
                                    />
                                )}
                            </div>
                        </DrawerContent>
                    </Drawer>
                )}

                <Sidebar
                    open={isNavSidebarOpen}
                    side="left"
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

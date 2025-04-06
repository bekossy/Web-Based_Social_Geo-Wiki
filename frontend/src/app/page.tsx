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
import {fetchAllCategoryList, fetchRetrieveSearchResult} from "@/services/mapbox"
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
import {getUserBookmarks} from "@/services/bookmark"
import {Bookmark} from "@/services/bookmark/types"

export default function Home() {
    const mapRef = useRef<MapRef>(null)
    const isDesktop = useMediaQuery("(min-width: 550px)")
    const {user} = useAuth()
    const [isLocationDrawerOpen, setIsLocationDrawerOpen] = useState(false)
    const [isNavSidebarOpen, setIsNavSidebarOpen] = useState(false)
    const [isBookmarkDrawerOpen, setIsBookmarkDrawerOpen] = useState(false)
    const [isLoadingLocationInfo, setIsLoadingLocationInfo] = useState(false)
    const [sessionToken, setSessionToken] = useState(() => uuidv4())

    const [locationFeatureInfo, setLocationFeatureInfo] = useState<
        SearchBoxRetrieveResponse["features"]
    >([])
    const [categoryList, setCategoryList] = useState<CategoryListResponse[]>([])
    const [mappins, setMappins] = useState<Mappins[]>([])
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
    const [selectedMappinLocation, setSelectedMappinLocation] = useState<Mappins | undefined>()
    const [selectedMappinBookmark, setSelectedMappinBookmark] = useState<Bookmark | undefined>()
    const [selectedMappinPosts, setSelectedMappinPosts] = useState<MappinPosts[]>([])

    const fetchMappins = useCallback(async () => {
        try {
            const [mappins, bookmarks] = await Promise.all([getAllMappins(), getUserBookmarks()])
            setMappins(mappins)
            setBookmarks(bookmarks)
        } catch (error) {
            console.error("Failed to fetch mappins and bookmarks:", error)
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
                (pin) => pin.mapboxId === locationFeatureInfo[0].properties.mapbox_id,
            )
            const activeBookmark = bookmarks.find(
                (bookmark) => bookmark.mapboxId === locationFeatureInfo[0].properties.mapbox_id,
            )
            setSelectedMappinLocation(activeMappin)
            setSelectedMappinBookmark(activeBookmark)
        }
    }, [locationFeatureInfo, mappins, bookmarks])

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

    const handleFetchBookmarkOnClick = async () => {
        try {
            const resp = await Promise.all(
                bookmarks.map(async (bookmark) => {
                    const data = await fetchRetrieveSearchResult({
                        mapboxId: bookmark.mapboxId,
                        session_token: sessionToken,
                    })
                    return data.features[0]
                }),
            )
            console.log("Bookmarks: ", resp)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <ProtectedRoute>
            <Navbar setIsNavSidebarOpen={setIsNavSidebarOpen} />
            <main className="h-screen w-full relative">
                <div className="max-w-[800px] my-0 mx-auto w-full absolute z-10 top-[80px] right-0 left-0 px-4 flex gap-2">
                    <MapControlPanel
                        mapRef={mapRef}
                        setIsLoadingLocationInfo={setIsLoadingLocationInfo}
                        setLocationFeatureInfo={setLocationFeatureInfo}
                        setIsLocationDrawerOpen={setIsLocationDrawerOpen}
                        sessionToken={sessionToken}
                        setSessionToken={setSessionToken}
                    />

                    <UserAvatar color={user?.color || ""} username={user?.username || ""} />
                </div>

                <MapView
                    mapRef={mapRef}
                    setLocationFeatureInfo={setLocationFeatureInfo}
                    setIsLocationDrawerOpen={setIsLocationDrawerOpen}
                    setIsLoadingLocationInfo={setIsLoadingLocationInfo}
                    sessionToken={sessionToken}
                    mappins={mappins}
                />

                {isDesktop ? (
                    <Sidebar
                        open={isLocationDrawerOpen}
                        handleOnOpenChange={setIsLocationDrawerOpen}
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
                                    selectedMappinBookmark={selectedMappinBookmark}
                                />
                            )
                        }
                        isLoading={isLoadingLocationInfo}
                    />
                ) : (
                    <Drawer open={isLocationDrawerOpen} onOpenChange={setIsLocationDrawerOpen}>
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
                                        selectedMappinBookmark={selectedMappinBookmark}
                                    />
                                )}
                            </div>
                        </DrawerContent>
                    </Drawer>
                )}

                {isDesktop ? (
                    <Sidebar
                        open={isBookmarkDrawerOpen}
                        handleOnOpenChange={setIsBookmarkDrawerOpen}
                        title="Title"
                        sidebarContent={<div>Your Bookmarks</div>}
                        isLoading={isLoadingLocationInfo}
                    />
                ) : (
                    <Drawer open={isBookmarkDrawerOpen} onOpenChange={setIsBookmarkDrawerOpen}>
                        <DrawerContent className="p-4 max-h-[75vh] h-[75vh]">
                            <div className="[&::-webkit-scrollbar]:w-0 overflow-auto h-full">
                                <DrawerHeader className="hidden">
                                    <DrawerTitle>Move Goal</DrawerTitle>
                                    <DrawerDescription>
                                        Set your daily activity goal.
                                    </DrawerDescription>
                                </DrawerHeader>
                                <div>Your Bookmarks</div>
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
                            setIsLocationDrawerOpen={setIsLocationDrawerOpen}
                            setIsBookmarkDrawerOpen={setIsBookmarkDrawerOpen}
                            categoryList={categoryList}
                            handleFetchBookmarkOnClick={handleFetchBookmarkOnClick}
                        />
                    }
                    isLoading={false}
                    className="p-0 block"
                />
            </main>
        </ProtectedRoute>
    )
}

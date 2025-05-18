"use client"

import {useCallback, useEffect, useRef, useState} from "react"
import {type MapRef} from "react-map-gl"
import {
    type SearchBoxFeatureSuggestion,
    type SearchBoxRetrieveResponse,
} from "@mapbox/search-js-core"

import MapControlPanel from "@/features/map/components/MapControlPanel"

import Navbar from "@/components/layout/Navbar"
import {NavigationSidebar} from "@/components/NavigationSidebar"
import ProtectedRoute from "@/components/ProtectedRoute"
import Sidebar from "@/components/layout/Sidebar"
import {getAllMappinPosts} from "@/services/posts"
import {MappinPosts} from "@/services/posts/types"
import {fetchAllCategoryList, fetchRetrieveSearchResult} from "@/services/mapbox"
import {type CategoryListResponse} from "@/services/mapbox/types"
import {getAllMappins} from "@/services/mappins"
import {Mappins} from "@/services/mappins/types"
import {v4 as uuidv4} from "uuid"
import MapView from "@/features/map/components/MapView"
import UserAvatar from "@/components/UserAvatar"
import {useAuth} from "@/contexts/AuthContext"
import {getUserBookmarks} from "@/services/bookmark"
import {Bookmark} from "@/services/bookmark/types"
import ResponsivePanel from "@/components/ResponsivePanel"
import LocationPanel from "@/components/LocationPanel"
import {useMediaQuery} from "@/hooks/use-media-query"

export default function Home() {
    const isDesktop = useMediaQuery("(min-width: 550px)")
    const mapRef = useRef<MapRef>(null)
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
    const [selectedMappinPosts, setSelectedMappinPosts] = useState<MappinPosts[]>([])

    const [bookmarkList, setBookmarkList] = useState<SearchBoxFeatureSuggestion[]>([])
    const [bookmarkListLoading, setBookmarkListLoading] = useState(false)

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

    const handleFetchBookmarkOnClick = async () => {
        try {
            setBookmarkListLoading(true)
            const resp = await Promise.all(
                bookmarks.map(async (bookmark) => {
                    const data = await fetchRetrieveSearchResult({
                        mapboxId: bookmark.mapboxId,
                        session_token: sessionToken,
                    })
                    return data.features[0]
                }),
            )
            setBookmarkList(resp)
        } catch (error) {
            console.error("Failed to fetch bookmarks:", error)
        } finally {
            setBookmarkListLoading(false)
        }
    }

    return (
        <ProtectedRoute>
            <Navbar setIsNavSidebarOpen={setIsNavSidebarOpen} isDesktop={isDesktop} />
            <main className="h-screen w-full relative">
                <div className="relative">
                    <div className="max-w-[750px] my-0 mx-auto w-full absolute z-10 top-[80px] right-0 left-0 px-4 flex gap-2">
                        <MapControlPanel
                            mapRef={mapRef}
                            setIsLoadingLocationInfo={setIsLoadingLocationInfo}
                            setLocationFeatureInfo={setLocationFeatureInfo}
                            setIsLocationDrawerOpen={setIsLocationDrawerOpen}
                            sessionToken={sessionToken}
                            setSessionToken={setSessionToken}
                            isDesktop={isDesktop}
                        />

                        <UserAvatar
                            color={user?.color || ""}
                            username={user?.username || ""}
                            className="absolute right-6 top-1"
                            size="sm"
                        />
                    </div>
                </div>

                <MapView
                    mapRef={mapRef}
                    setLocationFeatureInfo={setLocationFeatureInfo}
                    setIsLocationDrawerOpen={setIsLocationDrawerOpen}
                    setIsLoadingLocationInfo={setIsLoadingLocationInfo}
                    sessionToken={sessionToken}
                    mappins={mappins}
                />

                <ResponsivePanel
                    open={isLocationDrawerOpen}
                    onOpenChange={setIsLocationDrawerOpen}
                    title="Title"
                    content={
                        <LocationPanel
                            type="location"
                            data={locationFeatureInfo}
                            mapRef={mapRef}
                            sessionToken={sessionToken}
                            selectedMappinLocation={selectedMappinLocation}
                            fetchAllMappins={fetchMappins}
                            selectedMappinPosts={selectedMappinPosts}
                            fetchSelectedMappinPosts={fetchMappinPosts}
                            bookmarks={bookmarks}
                            setData={setLocationFeatureInfo}
                            setIsLoading={setIsLoadingLocationInfo}
                        />
                    }
                    isLoading={isLoadingLocationInfo}
                />

                <ResponsivePanel
                    open={isBookmarkDrawerOpen}
                    onOpenChange={setIsBookmarkDrawerOpen}
                    title="Title"
                    content={
                        <LocationPanel
                            type="bookmark"
                            data={bookmarkList}
                            mapRef={mapRef}
                            sessionToken={sessionToken}
                            selectedMappinLocation={selectedMappinLocation}
                            fetchAllMappins={fetchMappins}
                            selectedMappinPosts={selectedMappinPosts}
                            fetchSelectedMappinPosts={fetchMappinPosts}
                            bookmarks={bookmarks}
                            setData={setBookmarkList}
                            setIsLoading={setBookmarkListLoading}
                        />
                    }
                    isLoading={bookmarkListLoading}
                />

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

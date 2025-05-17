import LocationDetails from "@/features/locations/components/LocationDetails"
import LocationList from "@/features/locations/components/LocationList"
import EmptyState from "@/components/EmptyState"
import {MapPin, Bookmark as BookmarkIcon} from "lucide-react"
import {
    type SearchBoxFeatureSuggestion,
    type SearchBoxRetrieveResponse,
} from "@mapbox/search-js-core"
import {type MapRef} from "react-map-gl"
import {type Mappins} from "@/services/mappins/types"
import {type MappinPosts} from "@/services/posts/types"
import {type Bookmark} from "@/services/bookmark/types"
import {RefObject, Dispatch, SetStateAction} from "react"

type Props = {
    type: "location" | "bookmark"
    data: SearchBoxFeatureSuggestion[] | SearchBoxRetrieveResponse["features"]
    mapRef: RefObject<MapRef | null>
    sessionToken: string
    selectedMappinLocation: Mappins | undefined
    fetchAllMappins: () => Promise<void>
    selectedMappinPosts: MappinPosts[]
    fetchSelectedMappinPosts: () => Promise<void>
    bookmarks: Bookmark[]
    setData: Dispatch<SetStateAction<SearchBoxFeatureSuggestion[]>>
    setIsLoading: Dispatch<SetStateAction<boolean>>
}

const LocationPanel = ({
    type,
    data,
    mapRef,
    sessionToken,
    selectedMappinLocation,
    fetchAllMappins,
    selectedMappinPosts,
    fetchSelectedMappinPosts,
    bookmarks,
    setData,
    setIsLoading,
}: Props) => {
    if (data.length === 0) {
        return (
            <EmptyState
                icon={
                    type === "location" ? (
                        <MapPin className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    ) : (
                        <BookmarkIcon className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    )
                }
                title={`No ${type === "location" ? "locations" : "bookmarks"} found`}
                description={
                    type === "location"
                        ? "Try searching for a different location or adjusting your search terms."
                        : "Save locations to find them quickly later. Your bookmarked places will appear here."
                }
            />
        )
    }

    if (data.length > 1) {
        return (
            <LocationList
                locationFeatureInfo={data}
                setIsLoadingLocationInfo={setIsLoading}
                setLocationFeatureInfo={setData}
                mapRef={mapRef}
                sessionToken={sessionToken}
            />
        )
    }

    return (
        <LocationDetails
            locationFeatureInfo={data[0]}
            selectedMappinLocation={selectedMappinLocation}
            fetchAllMappins={fetchAllMappins}
            selectedMappinPosts={selectedMappinPosts}
            fetchSelectedMappinPosts={fetchSelectedMappinPosts}
            bookmarks={bookmarks}
        />
    )
}

export default LocationPanel

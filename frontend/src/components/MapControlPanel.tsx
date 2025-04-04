import {Dispatch, SetStateAction, RefObject} from "react"
import MapSearchbox from "./MapSearchbox"
import {Button} from "./ui/button"
import {type MapRef} from "react-map-gl"
import {type SearchBoxFeatureSuggestion} from "@mapbox/search-js-core"
import MakiIcon from "./MakiIcon"
import {fetchSearchCategory} from "@/services/mapbox"
import UserAvatar from "./UserAvatar"
import {useAuth} from "@/contexts/AuthContext"
import {CATEGORIES} from "@/lib/constants"

interface MapControlPanelProps {
    mapRef: RefObject<MapRef | null>
    setIsLoadingLocationInfo: Dispatch<SetStateAction<boolean>>
    setLocationFeatureInfo: Dispatch<SetStateAction<SearchBoxFeatureSuggestion[]>>
    setIsDrawerOpen: Dispatch<SetStateAction<boolean>>
    sessionToken: string
    setSessionToken: Dispatch<SetStateAction<string>>
}

const MapControlPanel = ({
    mapRef,
    setIsLoadingLocationInfo,
    setLocationFeatureInfo,
    setIsDrawerOpen,
    sessionToken,
    setSessionToken,
}: MapControlPanelProps) => {
    const {user} = useAuth()

    const handleSelectedCategory = async (canonicalId: string) => {
        try {
            const data = await fetchSearchCategory({canonicalId})
            setLocationFeatureInfo(data.features)
            setIsDrawerOpen(true)
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <>
            <div className="flex flex-col gap-1 flex-1">
                <MapSearchbox
                    mapRef={mapRef}
                    setIsLoadingLocationInfo={setIsLoadingLocationInfo}
                    setLocationFeatureInfo={setLocationFeatureInfo}
                    setIsDrawerOpen={setIsDrawerOpen}
                    sessionToken={sessionToken}
                    setSessionToken={setSessionToken}
                />

                <div className="flex flex-wrap items-center justify-center gap-2">
                    {CATEGORIES.map((category) => (
                        <Button
                            key={category.canonical_id}
                            size={"sm"}
                            variant={"outline"}
                            className="flex items-center gap-2"
                            onClick={() => handleSelectedCategory(category.canonical_id)}
                        >
                            <MakiIcon iconName={category.icon} />
                            {category.name}
                        </Button>
                    ))}
                </div>
            </div>

            <UserAvatar color={user?.color || ""} username={user?.username || ""} />
        </>
    )
}

export default MapControlPanel

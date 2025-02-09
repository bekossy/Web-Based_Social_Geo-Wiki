import {Dispatch, SetStateAction} from "react"
import MapSearchbox from "./MapSearchbox"
import {Button} from "./ui/button"
import {Avatar, AvatarFallback} from "./ui/avatar"
import {type MapRef} from "react-map-gl"
import {type SearchBoxFeatureSuggestion} from "@mapbox/search-js-core"
import MakiIcon from "./MakiIcon"
import {fetchSearchCategory} from "@/services/mapbox"

interface MapControlPanelProps {
    mapRef: React.RefObject<MapRef | null>
    setIsDrawerOpen: Dispatch<SetStateAction<boolean>>
    setIsLoadingLocationInfo: Dispatch<SetStateAction<boolean>>
    setLocationFeatureInfo: Dispatch<SetStateAction<SearchBoxFeatureSuggestion[]>>
}

const MapControlPanel = ({
    mapRef,
    setIsDrawerOpen,
    setIsLoadingLocationInfo,
    setLocationFeatureInfo,
}: MapControlPanelProps) => {
    const categories = [
        {
            canonical_id: "restaurant",
            icon: "restaurant",
            name: "Restaurant",
        },
        {
            canonical_id: "shopping_mall",
            icon: "marker",
            name: "Shopping Mall",
        },
        {
            canonical_id: "education",
            icon: "school",
            name: "Education",
        },
        {
            canonical_id: "park",
            icon: "park",
            name: "Park",
        },
        {
            canonical_id: "hotel",
            icon: "lodging",
            name: "Hotel",
        },
        {
            canonical_id: "tourist_attraction",
            icon: "attraction",
            name: "Tourist Attraction",
        },
    ]

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
                />

                <div className="flex flex-wrap items-center justify-center gap-2">
                    {categories.map((category) => (
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
            <Avatar className="h-10 w-10 rounded-full">
                <AvatarFallback className="rounded-full bg-purple-400 text-white font-bold">
                    JD
                </AvatarFallback>
            </Avatar>
        </>
    )
}

export default MapControlPanel

import MakiIcon from "@/components/MakiIcon"
import {fetchSearchCategory} from "@/services/mapbox"
import {CATEGORIES} from "@/lib/constants"
import MapSearchbox from "../MapSearchbox"
import {Button} from "@/components/ui/button"
import {MapControlPanelProps} from "./types"

const MapControlPanel = ({
    mapRef,
    setIsLoadingLocationInfo,
    setLocationFeatureInfo,
    setIsDrawerOpen,
    sessionToken,
    setSessionToken,
}: MapControlPanelProps) => {
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
    )
}

export default MapControlPanel

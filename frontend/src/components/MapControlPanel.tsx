import {Dispatch, SetStateAction} from "react"
import MapSearchbox from "./MapSearchbox"
import {Button} from "./ui/button"
import {Soup} from "lucide-react"
import {Avatar, AvatarFallback} from "./ui/avatar"
import {type MapRef} from "react-map-gl"
import {type SearchBoxFeatureSuggestion} from "@mapbox/search-js-core"

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
    return (
        <>
            <div className="flex flex-col gap-2 flex-1">
                <MapSearchbox
                    mapRef={mapRef}
                    setIsLoadingLocationInfo={setIsLoadingLocationInfo}
                    setLocationFeatureInfo={setLocationFeatureInfo}
                    setIsDrawerOpen={setIsDrawerOpen}
                />

                <div className="flex items-center justify-center gap-2">
                    {Array.from({length: 6}).map((_, i) => (
                        <Button
                            size={"sm"}
                            key={i}
                            variant={"secondary"}
                            className="flex items-center gap-2"
                        >
                            <Soup />
                            Food
                        </Button>
                    ))}
                    <Button
                        size={"sm"}
                        className="flex items-center gap-2"
                        onClick={() => setIsDrawerOpen((prev) => !prev)}
                    >
                        Toggle Drawer
                    </Button>
                </div>
            </div>
            <Avatar className="h-10 w-10 rounded-full">
                <AvatarFallback className="rounded-full bg-orange-600 text-white font-bold">
                    JD
                </AvatarFallback>
            </Avatar>
        </>
    )
}

export default MapControlPanel

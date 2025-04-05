import {ChevronRight} from "lucide-react"
import {Button} from "@/components/ui/button"
import LocationStaticImageCard from "@/components/LocationStaticImageCard"
import MapPoiCategoryBadges from "@/components/MapPoiCategoryBadges"
import LocationPropsContextInfo from "@/components/LocationPropsContextInfo"
import LocationCoordinates from "@/components/LocationCoordinates"
import {MapPopupProps} from "./types"

const MapPopup = ({locationInfo, setIsDrawerOpen}: MapPopupProps) => {
    return (
        <div className="border-muted-foreground overflow-hidden rounded-lg border bg-card shadow-lg">
            <LocationStaticImageCard featureProps={locationInfo.properties} />

            <div className="p-3 space-y-4">
                <MapPoiCategoryBadges featureProps={locationInfo.properties} />

                <div className="flex flex-col gap-3 text-sm">
                    <LocationPropsContextInfo featureProps={locationInfo.properties} />
                    <LocationCoordinates featureProps={locationInfo.properties} />
                </div>

                <Button
                    className="w-full group gap-2"
                    onClick={() => setIsDrawerOpen(true)}
                    variant="outline"
                >
                    View Details
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
            </div>
        </div>
    )
}

export default MapPopup

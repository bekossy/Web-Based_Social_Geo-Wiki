import {ScrollArea} from "@/components/ui/scroll-area"
import {MapPin, ChevronRight} from "lucide-react"
import {fetchRetrieveSearchResult} from "@/services/mapbox"
import {Button} from "@/components/ui/button"
import {LocationListProps} from "./types"
import LocationStaticImageCard from "@/components/LocationStaticImageCard"
import MapPoiCategoryBadges from "@/components/MapPoiCategoryBadges"
import LocationCoordinates from "@/components/LocationCoordinates"
import LocationPropsContextInfo from "@/components/LocationPropsContextInfo"

const LocationList = ({
    locationFeatureInfo,
    setIsLoadingLocationInfo,
    setLocationFeatureInfo,
    mapRef,
    sessionToken,
}: LocationListProps) => {
    const handleFetchLocationFeature = async (mapboxId: string) => {
        try {
            setIsLoadingLocationInfo(true)
            const response = await fetchRetrieveSearchResult({
                mapboxId,
                session_token: sessionToken,
            })

            const [longitude, latitude] = response.features[0].geometry.coordinates
            mapRef.current?.flyTo({
                center: [longitude, latitude],
                zoom: 14,
                essential: true,
            })

            setLocationFeatureInfo(response.features)
        } catch (error) {
            console.error("Error fetching Location Details: ", error)
        } finally {
            setIsLoadingLocationInfo(false)
        }
    }

    return (
        <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="flex flex-col gap-4">
                {locationFeatureInfo.map((location) => {
                    return (
                        <div
                            key={location.properties.mapbox_id}
                            onClick={() =>
                                handleFetchLocationFeature(location.properties.mapbox_id)
                            }
                            className="group rounded-lg border bg-card overflow-hidden transition-all hover:shadow-lg hover:border-primary cursor-pointer relative"
                            role="button"
                        >
                            <LocationStaticImageCard featureProps={location.properties} />

                            <div className="p-4 space-y-4">
                                <MapPoiCategoryBadges featureProps={location.properties} />

                                <div className="grid gap-3 text-sm">
                                    {location.properties?.full_address && (
                                        <div className="flex items-start gap-2 text-muted-foreground">
                                            <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                                            <span className="line-clamp-2">
                                                {location.properties?.full_address}
                                            </span>
                                        </div>
                                    )}

                                    <LocationPropsContextInfo featureProps={location.properties} />
                                    <LocationCoordinates featureProps={location.properties} />
                                </div>

                                <div className="flex items-center justify-end text-sm text-muted-foreground">
                                    <Button
                                        variant={"link"}
                                        className="flex items-center gap-1 group-hover:text-primary transition-colors"
                                    >
                                        View Details
                                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </ScrollArea>
    )
}

export default LocationList

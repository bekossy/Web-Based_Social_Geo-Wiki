import Image from "next/image"
import {Building2, Map, ChevronRight} from "lucide-react"
import {Button} from "./ui/button"
import {type SearchBoxFeatureSuggestion} from "@mapbox/search-js-core"
import {Dispatch, SetStateAction, useMemo} from "react"
import {getMapStaticImages} from "@/services/mapbox"
import {Badge} from "./ui/badge"

interface MapPopupProps {
    locationInfo: SearchBoxFeatureSuggestion
    setIsDrawerOpen: Dispatch<SetStateAction<boolean>>
}

const MapPopup = ({locationInfo, setIsDrawerOpen}: MapPopupProps) => {
    const mapStaticImage = useMemo(() => {
        return getMapStaticImages({
            lat: locationInfo.properties.coordinates.latitude,
            lon: locationInfo.properties.coordinates.longitude,
            zoom: 15,
        })
    }, [locationInfo])

    const neighborhood = locationInfo.properties.context?.neighborhood?.name
    const locality = locationInfo.properties.context?.locality?.name
    const place = locationInfo.properties.context?.place?.name
    const region = locationInfo.properties.context?.region?.name

    return (
        <div className="border-muted-foreground overflow-hidden rounded-lg border bg-card shadow-lg">
            <div className="relative aspect-[16/9]">
                <Image
                    src={mapStaticImage}
                    alt={`Map view of ${locationInfo.properties.name}`}
                    fill
                    className="object-cover"
                    sizes="300px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-semibold text-lg truncate">
                        {locationInfo.properties.name}
                    </h3>
                    {locationInfo.properties?.full_address && (
                        <p className="text-sm text-white/80 truncate">
                            {locationInfo.properties?.full_address}
                        </p>
                    )}
                </div>
            </div>

            <div className="p-3 space-y-4">
                <div className="flex items-center gap-1.5 flex-wrap">
                    {locationInfo.properties?.poi_category?.map(
                        (feature: string, index: number) => (
                            <Badge variant="outline" key={index} className="bg-primary/5 text-xs">
                                {feature}
                            </Badge>
                        )
                    )}
                </div>

                <div className="flex flex-col gap-3 text-sm">
                    {(neighborhood || locality || place) && (
                        <div className="flex items-start gap-2 text-muted-foreground">
                            <Building2 className="h-4 w-4 shrink-0 mt-0.5" />
                            <div className="space-y-1 truncate">
                                <div className="flex items-center gap-1">
                                    {[neighborhood, locality, place, region]
                                        .filter(Boolean)
                                        .map((item, index, arr) => (
                                            <span key={item} className="flex items-center">
                                                {item}
                                                {index < arr.length - 1 && (
                                                    <ChevronRight className="h-3 w-3 mx-0.5 text-muted-foreground/50" />
                                                )}
                                            </span>
                                        ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex items-start gap-2 text-muted-foreground">
                        <Map className="h-4 w-4 shrink-0 mt-0.5" />
                        <span className="text-xs font-mono">
                            {locationInfo.properties.coordinates.latitude.toFixed(4)},{" "}
                            {locationInfo.properties.coordinates.longitude.toFixed(4)}
                        </span>
                    </div>
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

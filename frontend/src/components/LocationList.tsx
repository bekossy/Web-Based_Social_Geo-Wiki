import {Dispatch, RefObject, SetStateAction} from "react"
import {ScrollArea} from "./ui/scroll-area"
import Image from "next/image"
import {MapPin, Building2, Map, ChevronRight} from "lucide-react"
import {type SearchBoxFeatureSuggestion} from "@mapbox/search-js-core"
import {type MapRef} from "react-map-gl"
import {fetchRetrieveSearchResult, getMapStaticImages} from "@/services/mapbox"
import {Skeleton} from "./ui/skeleton"
import {Badge} from "./ui/badge"
import {Button} from "./ui/button"

interface LocationListProps {
    locationFeatureInfo: SearchBoxFeatureSuggestion[]
    setIsLoadingLocationInfo: Dispatch<SetStateAction<boolean>>
    setLocationFeatureInfo: Dispatch<SetStateAction<SearchBoxFeatureSuggestion[]>>
    mapRef: RefObject<MapRef | null>
    sessionToken: string
}

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

    if (!locationFeatureInfo.length) {
        return (
            <div className="flex flex-col gap-4 p-4">
                <Skeleton className="h-[200px] w-full rounded-lg" />
                <Skeleton className="h-[200px] w-full rounded-lg" />
                <Skeleton className="h-[200px] w-full rounded-lg" />
            </div>
        )
    }

    return (
        <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="flex flex-col gap-4 p-4">
                {locationFeatureInfo.map((location) => {
                    const neighborhood = location.properties.context?.neighborhood?.name
                    const locality = location.properties.context?.locality?.name
                    const place = location.properties.context?.place?.name
                    const region = location.properties.context?.region?.name

                    return (
                        <div
                            key={location.properties.mapbox_id}
                            onClick={() =>
                                handleFetchLocationFeature(location.properties.mapbox_id)
                            }
                            className="group rounded-lg border bg-card overflow-hidden transition-all hover:shadow-lg hover:border-primary cursor-pointer relative"
                            role="button"
                        >
                            <div className="relative aspect-[16/9]">
                                <Image
                                    src={getMapStaticImages({
                                        lat: location.properties.coordinates.latitude,
                                        lon: location.properties.coordinates.longitude,
                                        zoom: 14,
                                    })}
                                    alt={`Map view of ${location.properties.name}`}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4 text-white">
                                    <h3 className="font-semibold text-xl truncate">
                                        {location.properties.name}
                                    </h3>
                                    {location.properties?.full_address && (
                                        <p className="text-sm text-white/80 truncate">
                                            {location.properties?.full_address}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="p-4 space-y-4">
                                <div className="flex items-center gap-2 flex-wrap">
                                    {location.properties?.poi_category?.map(
                                        (feature: string, index: number) => (
                                            <Badge
                                                variant="outline"
                                                key={index}
                                                className="bg-primary/5"
                                            >
                                                {feature}
                                            </Badge>
                                        )
                                    )}
                                </div>

                                <div className="grid gap-3 text-sm">
                                    {location.properties?.full_address && (
                                        <div className="flex items-start gap-2 text-muted-foreground">
                                            <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                                            <span className="line-clamp-2">
                                                {location.properties?.full_address}
                                            </span>
                                        </div>
                                    )}

                                    {(neighborhood || locality || place) && (
                                        <div className="flex items-start gap-2 text-muted-foreground truncate">
                                            <Building2 className="h-4 w-4 shrink-0 mt-0.5" />
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5">
                                                    {[neighborhood, locality, place, region]
                                                        .filter(Boolean)
                                                        .map((item, index, arr) => (
                                                            <span
                                                                key={item}
                                                                className="flex items-center"
                                                            >
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
                                            {location.properties.coordinates.latitude.toFixed(4)},{" "}
                                            {location.properties.coordinates.longitude.toFixed(4)}
                                        </span>
                                    </div>
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

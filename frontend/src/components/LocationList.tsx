import {Dispatch, RefObject, SetStateAction} from "react"
import {ScrollArea} from "./ui/scroll-area"
import Image from "next/image"
import {Button} from "./ui/button"
import {Clock, ExternalLink, MapPin, Phone, Star} from "lucide-react"
import {type SearchBoxFeatureSuggestion} from "@mapbox/search-js-core"
import {useMapboxSearch} from "@/hooks/useMapboxSearch"
import {type MapRef} from "react-map-gl"
import mapboxgl from "mapbox-gl"
import ReactDOMServer from "react-dom/server"
import MapPopup from "./MapPopup"

interface LocationListProps {
    locationFeatureInfo: SearchBoxFeatureSuggestion[]
    setIsLoadingLocationInfo: Dispatch<SetStateAction<boolean>>
    setLocationFeatureInfo: Dispatch<SetStateAction<SearchBoxFeatureSuggestion[]>>
    mapRef: RefObject<MapRef | null>
    setIsDrawerOpen: Dispatch<SetStateAction<boolean>>
}

const LocationList = ({
    locationFeatureInfo,
    setIsLoadingLocationInfo,
    setLocationFeatureInfo,
    mapRef,
    setIsDrawerOpen,
}: LocationListProps) => {
    const searchBoxCore = useMapboxSearch()

    const handleFetchLocationFeature = async (props: SearchBoxFeatureSuggestion["properties"]) => {
        try {
            setIsLoadingLocationInfo(true)
            const response = await searchBoxCore.retrieve(props, {
                sessionToken: "test-123",
            })

            const [longitude, latitude] = response.features[0].geometry.coordinates
            mapRef.current?.flyTo({
                center: [longitude, latitude],
                zoom: 14,
                essential: true,
            })
            if (mapRef.current) {
                const marker = new mapboxgl.Marker({color: "red"})
                    .setLngLat([longitude, latitude])
                    .addTo(mapRef.current.getMap())

                const popup = new mapboxgl.Popup({
                    offset: 25,
                    closeButton: false,
                    className: "z-10 min-w-[270px] !rounded-lg",
                    anchor: "right",
                }).setHTML(
                    ReactDOMServer.renderToString(<MapPopup locationInfo={response.features[0]} />)
                )

                popup.on("open", () => {
                    const popupElement = popup.getElement()
                    if (popupElement) {
                        const button = popupElement.querySelector(".view-more")
                        if (button) {
                            button.addEventListener("click", () => {
                                setIsDrawerOpen(true)
                            })
                        }
                    }
                })

                marker.setPopup(popup).getPopup()?.addTo(mapRef.current.getMap())
            }

            setLocationFeatureInfo(response.features)
        } catch (error) {
            console.error("Error fetching Location Details: ", error)
        } finally {
            setIsLoadingLocationInfo(false)
        }
    }

    return (
        <ScrollArea>
            <div className="flex flex-col gap-2">
                {locationFeatureInfo.map((location, index) => (
                    <div
                        key={index}
                        className="rounded-lg border bg-card overflow-hidden hover:border-primary transition-colors"
                        onClick={() => handleFetchLocationFeature(location.properties)}
                    >
                        <div className="relative aspect-video">
                            <Image
                                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Photo by Drew Beamer"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-lg">
                                        {location.properties.name}
                                    </h3>
                                    <div className="flex items-center gap-1 text-sm">
                                        <Star className="h-4 w-4 fill-primary text-primary" />
                                        <span>5</span>
                                        <span className="text-muted-foreground">(36)</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-sm font-medium">23</span>
                                    <span className="text-sm text-muted-foreground">•</span>
                                    <span className="text-sm text-muted-foreground">
                                        {location.properties.poi_category}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span>{"location.hours"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Phone className="h-4 w-4" />
                                    <span>{"location.phone"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    <span>{location.properties.full_address}</span>
                                </div>
                            </div>

                            <p className="text-sm text-muted-foreground">
                                {location.properties.full_address}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {location.properties.poi_category.map((feature: string) => (
                                    <span
                                        key={feature}
                                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    >
                                        {feature}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center gap-2">
                                <Button className="w-full gap-2">
                                    View Location
                                    <ExternalLink className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
    )
}

export default LocationList

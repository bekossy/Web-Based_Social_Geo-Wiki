import {Button} from "@/components/ui/button"
import {getMapStaticImages} from "@/services/mapbox"
import {Building2, Globe, ImageIcon, Info, Navigation} from "lucide-react"
import Image from "next/image"
import React from "react"
import {OverviewSectionProps} from "./types"

const OverviewSection = ({isPinned, locationData}: OverviewSectionProps) => {
    return (
        <div className="space-y-6">
            {!isPinned && (
                <>
                    <div className="rounded-lg flex border bg-muted/50 p-4 text-center">
                        <Info className="text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                            Pin this location to enable community posts and share your experiences
                        </p>
                    </div>
                </>
            )}
            <div className="space-y-4">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 animate-pulse text-muted-foreground" />
                    </div>
                    <div className="relative w-full h-full">
                        <Image
                            src={getMapStaticImages({
                                lat: locationData.coordinates.latitude,
                                lon: locationData.coordinates.longitude,
                            })}
                            alt={`Image of ${locationData.name}`}
                            fill
                            className="object-cover transition-opacity duration-300"
                            sizes="(max-width: 768px) 100vw, 800px"
                        />
                    </div>
                </div>
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-2">Location Details</h3>
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                            <p className="font-medium">Address</p>
                            <p className="text-sm text-muted-foreground">
                                {locationData.full_address}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Navigation className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                            <p className="font-medium">Region</p>
                            <p className="text-sm text-muted-foreground">
                                {locationData.place_formatted}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                            <p className="font-medium">Country</p>
                            <p className="text-sm text-muted-foreground">
                                {locationData.context.country?.name}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-2">Coordinates</h3>
                <p className="text-sm text-muted-foreground">
                    Latitude: {locationData.coordinates.latitude.toFixed(3)}
                    <br />
                    Longitude: {locationData.coordinates.longitude.toFixed(3)}
                </p>
            </div>
            <div className="pt-4">
                <Button
                    className="w-full"
                    onClick={() => {
                        window.open(
                            `https://www.google.com/maps/search/?api=1&query=${locationData.coordinates.latitude},${locationData.coordinates.longitude}`,
                            "_blank"
                        )
                    }}
                >
                    Open in Google Maps
                </Button>
            </div>
        </div>
    )
}

export default OverviewSection

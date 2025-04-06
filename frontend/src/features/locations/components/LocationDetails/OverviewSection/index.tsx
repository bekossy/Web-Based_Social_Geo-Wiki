import {Button} from "@/components/ui/button"
import {getMapStaticImages} from "@/services/mapbox"
import {
    Accessibility,
    Bookmark,
    ExternalLink,
    ImageIcon,
    Info,
    MapPin,
    Navigation,
    Phone,
    Tag,
    Link as LucideLink,
    MapPinMinusInside,
    MapPinPlusInside,
    BookmarkMinus,
} from "lucide-react"
import Image from "next/image"
import React from "react"
import {OverviewSectionProps} from "./types"
import {Card} from "@/components/ui/card"
import MapPoiCategoryBadges from "@/components/MapPoiCategoryBadges"
import Link from "next/link"
import {MetadataItem} from "./metadataRenderers/MetadataItem"
import {renderOpeningHours} from "./metadataRenderers/renderOpeningHours"

const OverviewSection = ({
    locationData,
    isPinned,
    canRemovePin,
    handleAddLocationPin,
    handleRemoveLocationPin,
    isAddingPinLoading,
    isRemovingPinLoading,
    handleBookmarkLocation,
    isBookmarkLoading,
    handleUnbookmarkLocation,
    isBookmarked,
}: OverviewSectionProps) => {
    const {metadata = {}} = locationData

    return (
        <div className="space-y-6">
            {!isPinned && (
                <Card className="bg-muted/50 p-4">
                    <div className="flex gap-3 items-center">
                        <Info className="h-5 w-5 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                            Pin this location to enable community posts and share your experiences
                        </p>
                    </div>
                </Card>
            )}

            <div className="flex justify-between items-center gap-4">
                <div className="flex-1">
                    <h2 className="text-2xl font-semibold">{locationData.name}</h2>
                    <p className="text-sm text-muted-foreground">{locationData.full_address}</p>
                </div>
                <div className="flex gap-2">
                    {!isPinned && (
                        <Button
                            variant={"default"}
                            size="icon"
                            title={"Pin Location"}
                            onClick={handleAddLocationPin}
                            disabled={isAddingPinLoading}
                        >
                            <MapPinPlusInside />
                        </Button>
                    )}
                    {canRemovePin && (
                        <Button
                            variant={"destructive"}
                            size="icon"
                            title={"Unpin Location"}
                            onClick={handleRemoveLocationPin}
                            disabled={isRemovingPinLoading}
                        >
                            <MapPinMinusInside />
                        </Button>
                    )}
                    <Button
                        size="icon"
                        variant={"outline"}
                        title={isBookmarked ? "Unbookmark Location" : "Bookmark Location"}
                        onClick={isBookmarked ? handleUnbookmarkLocation : handleBookmarkLocation}
                        disabled={isBookmarkLoading}
                    >
                        {isBookmarked ? <BookmarkMinus /> : <Bookmark />}
                    </Button>
                </div>
            </div>

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
                        alt={`Map of ${locationData.name}`}
                        fill
                        className="object-cover transition-opacity duration-300"
                        sizes="(max-width: 768px) 100vw, 800px"
                    />
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                        <Info className="h-5 w-5" />
                        Basic Information
                    </h3>
                    <div className="grid gap-4">
                        <MetadataItem icon={MapPin} label="Address">
                            {locationData.full_address}
                        </MetadataItem>

                        {metadata.phone && (
                            <MetadataItem icon={Phone} label="Phone">
                                {metadata.phone}
                            </MetadataItem>
                        )}

                        {metadata.website && (
                            <MetadataItem icon={LucideLink} label="Website">
                                <Link
                                    href={metadata.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline text-primary break-all"
                                >
                                    {metadata.website}
                                </Link>
                            </MetadataItem>
                        )}

                        {"wheelchair_accessible" in metadata && (
                            <MetadataItem icon={Accessibility} label="Accessibility">
                                {metadata.wheelchair_accessible
                                    ? "Wheelchair accessible"
                                    : "Not wheelchair accessible"}
                            </MetadataItem>
                        )}

                        {metadata.open_hours && (
                            <MetadataItem icon={Navigation} label="Opening Hours">
                                <ul className="space-y-1 mt-1">
                                    {renderOpeningHours({open_hours: metadata.open_hours})}
                                </ul>
                            </MetadataItem>
                        )}

                        {locationData.place_formatted && (
                            <MetadataItem icon={Tag} label="Type">
                                <span className="capitalize">{locationData.place_formatted}</span>
                            </MetadataItem>
                        )}
                    </div>
                </div>

                {locationData.poi_category?.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                            <Tag className="h-5 w-5" />
                            Categories
                        </h3>
                        <MapPoiCategoryBadges variant="secondary" featureProps={locationData} />
                    </div>
                )}

                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                        <Navigation className="h-5 w-5" />
                        Geographic Coordinates
                    </h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Latitude</span>
                            <span className="font-mono">
                                {locationData.coordinates.latitude.toFixed(6)}°
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Longitude</span>
                            <span className="font-mono">
                                {locationData.coordinates.longitude.toFixed(6)}°
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <Button
                        variant="outline"
                        className="w-full gap-2"
                        onClick={() =>
                            window.open(
                                `https://www.google.com/maps/search/?api=1&query=${locationData.coordinates.latitude},${locationData.coordinates.longitude}`,
                                "_blank"
                            )
                        }
                    >
                        <ExternalLink className="h-4 w-4" />
                        View on Google Maps
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default OverviewSection

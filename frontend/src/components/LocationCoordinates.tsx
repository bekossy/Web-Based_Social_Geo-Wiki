import {type SearchBoxFeatureProperties} from "@mapbox/search-js-core/dist/searchbox/types"
import {Map} from "lucide-react"
import React from "react"

const LocationCoordinates = ({featureProps}: {featureProps: SearchBoxFeatureProperties}) => {
    return (
        <div className="flex items-start gap-2 text-muted-foreground">
            <Map className="h-4 w-4 shrink-0 mt-0.5" />
            <span className="text-xs font-mono">
                {featureProps.coordinates.latitude.toFixed(4)},{" "}
                {featureProps.coordinates.longitude.toFixed(4)}
            </span>
        </div>
    )
}

export default LocationCoordinates

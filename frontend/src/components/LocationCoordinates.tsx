import {type SearchBoxFeatureProperties} from "@mapbox/search-js-core/dist/searchbox/types"
import {Map} from "lucide-react"
import React from "react"

const LocationCoordinates = ({props}: {props: SearchBoxFeatureProperties}) => {
    return (
        <div className="flex items-start gap-2 text-muted-foreground">
            <Map className="h-4 w-4 shrink-0 mt-0.5" />
            <span className="text-xs font-mono">
                {props.coordinates.latitude.toFixed(4)}, {props.coordinates.longitude.toFixed(4)}
            </span>
        </div>
    )
}

export default LocationCoordinates

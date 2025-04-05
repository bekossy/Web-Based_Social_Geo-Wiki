import {type SearchBoxFeatureProperties} from "@mapbox/search-js-core/dist/searchbox/types"
import {Building2, ChevronRight} from "lucide-react"
import React from "react"

const LocationPropsContextInfo = ({featureProps}: {featureProps: SearchBoxFeatureProperties}) => {
    const neighborhood = featureProps.context?.neighborhood?.name
    const locality = featureProps.context?.locality?.name
    const place = featureProps.context?.place?.name
    const region = featureProps.context?.region?.name

    return (
        (neighborhood || locality || place) && (
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
        )
    )
}

export default LocationPropsContextInfo

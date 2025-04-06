import React from "react"
import {Badge} from "./ui/badge"
import {type SearchBoxFeatureProperties} from "@mapbox/search-js-core/dist/searchbox/types"

const MapPoiCategoryBadges = ({
    featureProps,
    ...props
}: {featureProps: SearchBoxFeatureProperties} & React.ComponentProps<typeof Badge>) => {
    return (
        <div className="flex items-center gap-1.5 flex-wrap">
            {featureProps?.poi_category?.map((feature: string, index: number) => (
                <Badge variant="outline" key={index} className="bg-primary/5 text-xs" {...props}>
                    {feature}
                </Badge>
            ))}
        </div>
    )
}

export default MapPoiCategoryBadges

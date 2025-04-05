import React from "react"
import {Badge} from "./ui/badge"
import {type SearchBoxFeatureProperties} from "@mapbox/search-js-core/dist/searchbox/types"

const MapPoiCategoryBadges = ({props}: {props: SearchBoxFeatureProperties}) => {
    return (
        <div className="flex items-center gap-1.5 flex-wrap">
            {props?.poi_category?.map((feature: string, index: number) => (
                <Badge variant="outline" key={index} className="bg-primary/5 text-xs">
                    {feature}
                </Badge>
            ))}
        </div>
    )
}

export default MapPoiCategoryBadges

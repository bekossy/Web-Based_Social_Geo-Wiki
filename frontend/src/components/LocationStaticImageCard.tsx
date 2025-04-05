import React from "react"
import Image from "next/image"
import {getMapStaticImages} from "@/services/mapbox"
import {type SearchBoxFeatureProperties} from "@mapbox/search-js-core/dist/searchbox/types"

const LocationStaticImageCard = ({featureProps}: {featureProps: SearchBoxFeatureProperties}) => {
    return (
        <div className="relative aspect-[16/9]">
            <Image
                src={getMapStaticImages({
                    lat: featureProps.coordinates.latitude,
                    lon: featureProps.coordinates.longitude,
                    zoom: 14,
                })}
                alt={`Map view of ${featureProps.name}`}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-semibold text-xl truncate">{featureProps.name}</h3>
                {featureProps?.full_address && (
                    <p className="text-sm text-white/80 truncate">{featureProps?.full_address}</p>
                )}
            </div>
        </div>
    )
}

export default LocationStaticImageCard

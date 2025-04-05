import {type SearchBoxFeatureSuggestion} from "@mapbox/search-js-core"
import {type MapRef} from "react-map-gl"
import {Dispatch, RefObject, SetStateAction} from "react"

export interface LocationListProps {
    locationFeatureInfo: SearchBoxFeatureSuggestion[]
    setIsLoadingLocationInfo: Dispatch<SetStateAction<boolean>>
    setLocationFeatureInfo: Dispatch<SetStateAction<SearchBoxFeatureSuggestion[]>>
    mapRef: RefObject<MapRef | null>
    sessionToken: string
}

import {Dispatch, RefObject, SetStateAction} from "react"
import {type MapRef} from "react-map-gl"
import {type SearchBoxFeatureSuggestion} from "@mapbox/search-js-core"

export interface MapSearchboxProps {
    mapRef: RefObject<MapRef | null>
    isLoading?: boolean
    disabled?: boolean
    placeholder?: string
    emptyMessage?: string
    setIsLoadingLocationInfo: Dispatch<SetStateAction<boolean>>
    setLocationFeatureInfo: Dispatch<SetStateAction<SearchBoxFeatureSuggestion[]>>
    setIsDrawerOpen: Dispatch<SetStateAction<boolean>>
    sessionToken: string
    setSessionToken: Dispatch<SetStateAction<string>>
}

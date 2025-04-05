import {Dispatch, SetStateAction, RefObject} from "react"
import {type MapRef} from "react-map-gl"
import {type SearchBoxFeatureSuggestion} from "@mapbox/search-js-core"

export interface MapControlPanelProps {
    mapRef: RefObject<MapRef | null>
    setIsLoadingLocationInfo: Dispatch<SetStateAction<boolean>>
    setLocationFeatureInfo: Dispatch<SetStateAction<SearchBoxFeatureSuggestion[]>>
    setIsLocationDrawerOpen: Dispatch<SetStateAction<boolean>>
    sessionToken: string
    setSessionToken: Dispatch<SetStateAction<string>>
}

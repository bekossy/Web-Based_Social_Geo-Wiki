import {Mappins} from "@/services/mappins/types"
import {Dispatch, RefObject, SetStateAction} from "react"
import {type MapRef} from "react-map-gl"

export interface MapViewProps {
    mapRef: RefObject<MapRef | null>
    setIsLoadingLocationInfo: Dispatch<SetStateAction<boolean>>
    setLocationFeatureInfo: Dispatch<SetStateAction<SearchBoxFeatureSuggestion[]>>
    setIsDrawerOpen: Dispatch<SetStateAction<boolean>>
    sessionToken: string
    mappins: Mappins[]
}

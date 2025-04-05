import {type SearchBoxFeatureSuggestion} from "@mapbox/search-js-core"
import {Dispatch, SetStateAction} from "react"

export interface MapPopupProps {
    locationInfo: SearchBoxFeatureSuggestion
    setIsDrawerOpen: Dispatch<SetStateAction<boolean>>
}

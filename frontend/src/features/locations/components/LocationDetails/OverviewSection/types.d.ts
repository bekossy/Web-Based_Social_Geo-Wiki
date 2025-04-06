import {type SearchBoxFeatureProperties} from "@mapbox/search-js-core/dist/searchbox/types"

export interface OverviewSectionProps {
    isPinned: boolean
    canRemovePin: boolean
    handleAddLocationPin: () => Promise<void>
    handleRemoveLocationPin: () => Promise<void>
    isAddingPinLoading: boolean
    isRemovingPinLoading: boolean
    handleBookmarkLocation: () => Promise<void>
    isBookmarkLoading: boolean
    locationData: SearchBoxFeatureProperties
    handleUnbookmarkLocation: () => Promise<void>
    isBookmarked: boolean
}

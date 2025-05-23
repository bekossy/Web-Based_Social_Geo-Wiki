import {type SearchBoxFeatureSuggestion} from "@mapbox/search-js-core"
import {type Mappins} from "@/services/mappins/types"
import {type MappinPosts} from "@/services/posts/types"
import {type Bookmark} from "@/services/bookmark/types"

export interface LocationDetailsProps {
    locationFeatureInfo: SearchBoxFeatureSuggestion
    selectedMappinLocation: Mappins | undefined
    fetchAllMappins: () => Promise<void>
    selectedMappinPosts: MappinPosts[]
    fetchSelectedMappinPosts: () => Promise<void>
    bookmarks: Bookmark[]
}

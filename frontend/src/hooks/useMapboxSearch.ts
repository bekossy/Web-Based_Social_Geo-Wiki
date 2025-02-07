import {useSearchBoxCore} from "@mapbox/search-js-react"

export const useMapboxSearch = () => {
    return useSearchBoxCore({
        accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!,
    })
}

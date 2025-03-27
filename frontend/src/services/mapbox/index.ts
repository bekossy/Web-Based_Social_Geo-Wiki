import {
    type SearchBoxRetrieveResponse,
    type SearchBoxCategoryResponse,
    type SearchBoxSuggestionResponse,
} from "@mapbox/search-js-core"
import axios from "axios"
import {type AllCategoryListResponse} from "./types"

// Get suggested results
export const fetchSearchSuggestion = async ({
    searchValue,
    session_token,
}: {
    searchValue: string
    session_token: string
}): Promise<SearchBoxSuggestionResponse> => {
    const {data} = await axios(`https://api.mapbox.com/search/searchbox/v1/suggest`, {
        params: {
            q: searchValue,
            session_token,
            access_token: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
        },
    })

    return data
}

// Retrieve suggested feature
export const fetchRetrieveSearchResult = async ({
    mapboxId,
    session_token,
}: {
    mapboxId: string
    session_token: string
}): Promise<SearchBoxRetrieveResponse> => {
    const {data} = await axios(`https://api.mapbox.com/search/searchbox/v1/retrieve/${mapboxId}`, {
        params: {
            access_token: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
            session_token,
        },
    })

    return data
}

// List categories
export const fetchAllCategoryList = async (): Promise<AllCategoryListResponse> => {
    const {data} = await axios("https://api.mapbox.com/search/searchbox/v1/list/category", {
        params: {
            access_token: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
        },
    })
    return data
}

// Category Search
export const fetchSearchCategory = async ({
    canonicalId,
}: {
    canonicalId: string
}): Promise<SearchBoxCategoryResponse> => {
    const {data} = await axios(
        `https://api.mapbox.com/search/searchbox/v1/category/${canonicalId}`,
        {
            params: {
                access_token: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
            },
        }
    )
    return data
}

export const getMapStaticImages = ({
    lon,
    lat,
    zoom = 16,
    marker = true,
}: {
    lon: number
    lat: number
    zoom?: number
    marker?: boolean
}): string => {
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    const markerLayer = marker ? `pin-s+ff0000(${lon},${lat})/` : ""
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${markerLayer}${lon},${lat},${zoom},0/400x300@2x?access_token=${accessToken}`
}

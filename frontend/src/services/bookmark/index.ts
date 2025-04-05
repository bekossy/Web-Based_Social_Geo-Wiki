import axiosConfig from "@/lib/axiosConfig"
import {Bookmark} from "./types"

export const getUserBookmarks = async (): Promise<Bookmark[]> => {
    const {data} = await axiosConfig.get("/bookmark")
    return data.bookmarks
}

export const createBookmark = async (bookmarkData: {mapboxId: string}): Promise<Bookmark> => {
    const {data} = await axiosConfig.post("/bookmark", bookmarkData)
    return data.bookmark
}

export const deleteBookmark = async ({bookmarkId}: {bookmarkId: string}) => {
    const {data} = await axiosConfig.delete(`bookmark/${bookmarkId}`)
    return data
}

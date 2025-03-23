import axiosConfig from "@/lib/axiosConfig"
import {MappinPosts} from "./types"

export const getAllMappinPosts = async ({mappinId}: {mappinId: string}): Promise<MappinPosts[]> => {
    const {data} = await axiosConfig.get(`/posts/${mappinId}/pin`)
    return data.posts
}

export const createMappinPosts = async (postData: FormData): Promise<MappinPosts> => {
    const {data} = await axiosConfig.post(`/posts/pin`, postData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    return data.post
}

export const deleteMappinPosts = async ({mappinId}: {mappinId: string}) => {
    const {data} = await axiosConfig.delete(`/posts/${mappinId}/pin`)
    return data
}

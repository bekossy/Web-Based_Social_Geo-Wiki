import axiosConfig from "@/lib/axiosConfig"
import {MappinComments} from "./types"

export const getAllMappinComments = async ({
    mappinId,
}: {
    mappinId: string
}): Promise<MappinComments[]> => {
    const {data} = await axiosConfig.get(`/comments/${mappinId}/pin`)
    return data.comments
}

export const createMappinComment = async (commentData: {
    title: string
    description: string
    rating: number
    mappinId: string
}): Promise<MappinComments> => {
    const {data} = await axiosConfig.post(`/comments/pin`, commentData)
    return data.comment
}

export const deleteMappinComment = async ({mappinId}: {mappinId: string}) => {
    const {data} = await axiosConfig.delete(`/comments/${mappinId}/pin`)
    return data
}

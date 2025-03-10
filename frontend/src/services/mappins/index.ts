import axiosConfig from "@/lib/axiosConfig"
import {Mappins} from "./types"

export const getAllMappins = async (): Promise<Mappins[]> => {
    const {data} = await axiosConfig.get("/mappin")
    return data.mappins
}

export const createMappin = async (mappinData: {
    mapboxId: string
    longitude: number
    latitude: number
}): Promise<Mappins> => {
    const {data} = await axiosConfig.post("/mappin", mappinData)
    return data.mappin
}

export const deleteMappin = async ({mappinId}: {mappinId: string}) => {
    const {data} = await axiosConfig.delete(`mappin/${mappinId}`)
    return data
}

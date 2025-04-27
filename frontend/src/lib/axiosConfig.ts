import axiosApi from "axios"
import {getLocalStorageToken} from "@/lib/authUtils"

const axiosConfig = axiosApi.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
})

axiosConfig.interceptors.request.use((config) => {
    const localStorageToken = getLocalStorageToken()

    if (localStorageToken) {
        config.headers.Authorization = `Bearer ${localStorageToken}`
    }

    return config
})

export default axiosConfig

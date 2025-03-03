import axiosApi from "axios"

const axiosConfig = axiosApi.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
})

export default axiosConfig

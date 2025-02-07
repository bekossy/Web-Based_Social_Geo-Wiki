import axios from "axios"

export const fetchIpDetails = async () => {
    const response = await axios("https://ipapi.co/json")
    return response.data
}

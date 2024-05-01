import { ApiResponse } from "@/types"
import axios, { AxiosResponse } from "axios"

export const seaRatesApi = async (tracking_number: string): Promise<AxiosResponse<ApiResponse>> => {
    const res = axios.get(`${process.env.SEARATES_URL}/tracking?api_key=${process.env.SEARATES_API_KEY}&number=${tracking_number}` as string)
    return res
}
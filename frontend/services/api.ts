import axios from "axios"
import { getApiUrl } from "../app/utils/apiConfig"

const API = axios.create({
  baseURL: getApiUrl()
})

export const fetchKPIs = () => API.get("/dashboard/kpi")

export const fetchMonthlyTrend = () => API.get("/dashboard/monthly-trend")

export const fetchPlatforms = () => API.get("/dashboard/platforms")

export const fetchChannels = (platform:string) =>
  API.get(`/dashboard/channels?platform=${platform}`)

export const fetchAlerts = () => API.get("/dashboard/alerts")

export const fetchMonthDuration = () => API.get("/dashboard/monthly-duration-trend")

export const fetchVideoDetails = (params: Record<string, any>) =>
  API.get("/dashboard/video-details", { params })
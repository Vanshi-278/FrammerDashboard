import axios from "axios"

const API = axios.create({
  baseURL: "http://127.0.0.1:8000"
})

export const fetchKPIs = () => API.get("/dashboard/kpis")

export const fetchMonthlyTrend = () => API.get("/dashboard/monthly-trend")

export const fetchPlatforms = () => API.get("/dashboard/platforms")

export const fetchChannels = (platform:string) =>
  API.get(`/dashboard/channels?platform=${platform}`)

export const fetchAlerts = () => API.get("/dashboard/alerts")
import axios from "axios"

const BASE_URL = "http://127.0.0.1:8000/api"

// -------------------------------
// Upload / Create / Publish trend
// -------------------------------
export const getUsageTrend = async (period: string) => {
  const res = await axios.get(`${BASE_URL}/usage/trend?period=${period}`)
  return res.data
}

// -------------------------------
// Duration trend
// -------------------------------
export const getDurationTrend = async (period: string) => {
  const res = await axios.get(`${BASE_URL}/usage/duration-trend?period=${period}`)
  return res.data
}

// -------------------------------
// Contributions (Top / Underused)
// -------------------------------
export const getContributions = async (
  level: string,
  parent?: string,
  metric: string = "published",
  type: string = "top",
  period: string = "month"   // 🔥 ADDED
) => {

  let url = `/usage/contributions?level=${level}&metric=${metric}&type=${type}&period=${period}`

  if (parent) {
    url += `&parent=${parent}`
  }

  console.log("API CALL:", url)

  const res = await axios.get(`${BASE_URL}${url}`)
  return res.data
}

// -------------------------------
// Underused (wrapper)
// -------------------------------
export const getUnderused = async (
  level: string = "client",
  parent?: string,
  period: string = "month"   // 🔥 ADDED
) => {
  return getContributions(level, parent, "efficiency", "underused", period)
}

// -------------------------------
// Channel usage (uses usage trend endpoint)
// -------------------------------
export const getChannelUsage = async (period: string = "month") => {
  // The backend does not currently expose a dedicated channel-usage endpoint.
  // Reuse the usage trend endpoint for now.
  return getUsageTrend(period)
}

export const channelUsage = async (period: string = "month") => {
  return getUsageTrend(period)
}

// -------------------------------
// Platform distribution
// -------------------------------
export const getPlatformDistribution = async () => {
  const res = await axios.get(`${BASE_URL}/usage/platform-distribution`)
  return res.data
}

// -------------------------------
// Channel vs platform
// -------------------------------
export const getChannelPlatform = async () => {
  const res = await axios.get(`${BASE_URL}/usage/channel-platform`)
  return res.data
}
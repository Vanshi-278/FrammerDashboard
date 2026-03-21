import axios from "axios";
import { getApiUrl } from "../app/utils/apiConfig";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api"
})


// -------------------------------
// Trend Endpoints
// -------------------------------
export const getUsageTrend = (period: string) => 
  API.get(`/usage/trend?period=${period}`).then(res => res.data);

export const getDurationTrend = (period: string) => 
  API.get(`/usage/duration-trend?period=${period}`).then(res => res.data);

// -------------------------------
// Contributions
// -------------------------------
export const getContributions = (
  level: string,
  parent?: string,
  metric: string = "published",
  type: string = "top",
  period: string = "month"
) => {
  // Use 'params' object for cleaner URL management
  return API.get("/usage/contributions", {
    params: { level, parent, metric, type, period }
  }).then(res => res.data);
};

export const getUnderused = (level: string = "client", parent?: string, period: string = "month") => {
  return getContributions(level, parent, "efficiency", "underused", period);
};

// -------------------------------
// Distribution Endpoints
// -------------------------------
export const getPlatformDistribution = () => 
  API.get("/usage/platform-distribution").then(res => res.data);

export const getChannelPlatform = () => 
  API.get("/usage/channel-platform").then(res => res.data);
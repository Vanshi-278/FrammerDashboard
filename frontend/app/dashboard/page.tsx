"use client"

import {useEffect,useState} from "react"

import KPIGrid from "../components/KPIGrid"
import TrendChart from "../components/TrendChart"
import PlatformPie from "../components/PlatformPie"
import ChannelBar from "../components/ChannelBar"
import AlertsSlider from "../components/AlertSlider"

import {
fetchKPIs,
fetchMonthlyTrend,
fetchPlatforms,
fetchChannels,
fetchAlerts
} from "@/services/api"

export default function Dashboard(){

const [kpis,setKpis]=useState({})
const [trend,setTrend]=useState([])
const [platform,setPlatform]=useState([])
const [channels,setChannels]=useState([])
const [alerts,setAlerts]=useState([])

const handlePlatformClick=async(platform:string)=>{

const res=await fetchChannels(platform)

setChannels(res.data)

}

useEffect(()=>{

fetchKPIs().then(r=>setKpis(r.data))
fetchMonthlyTrend().then(r=>setTrend(r.data))
fetchPlatforms().then(r=>setPlatform(r.data))
fetchAlerts().then(r=>setAlerts(r.data))

},[])

return(

<div className="p-8 space-y-8 bg-[#020617] min-h-screen">

<AlertsSlider alerts={alerts}/>

<KPIGrid data={kpis}/>

<TrendChart data={trend}/>

<div className="grid grid-cols-2 gap-6">

<PlatformPie data={platform} onSelect={handlePlatformClick}/>

<ChannelBar data={channels}/>

</div>

</div>

)

}
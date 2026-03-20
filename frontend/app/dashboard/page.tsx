// "use client"

// import {useEffect,useState} from "react"

// import KPIGrid from "../components/KPIGrid"
// import TrendChart from "../components/TrendChart"
// import PlatformPie from "../components/PlatformPie"
// import ChannelBar from "../components/ChannelBar"
// import AlertsSlider from "../components/AlertSlider"

// import {
// fetchKPIs,
// fetchMonthlyTrend,
// fetchMonthDuration,
// fetchPlatforms,
// fetchChannels,
// fetchAlerts
// } from "@/services/api"


// type KPI = {
//   uploaded: number
//   published: number
//   created: number
//   published_rate: number
// }

// export default function Dashboard(){

// const [kpis,setKpis]=useState<KPI |null>(null)
// const [trend,setTrend]=useState([])
// const [platform,setPlatform]=useState([])
// const [channels,setChannels]=useState([])
// const [types,setTypes]=useState([])
// const [users,setUsers]=useState([])
// const [alerts,setAlerts]=useState([])
// const [duration, setDuration] = useState([])

// const [selectedPlatform,setSelectedPlatform] = useState("")
// const handlePlatformClick=async(platform:string)=>{
// setSelectedPlatform(platform)
// const res=await fetchChannels(platform)

// setChannels(res.data.channels)
// setTypes(res.data.types)
// setUsers(res.data.users)

// }

// useEffect(()=>{

// fetchKPIs().then(r=>
//     {  
//         setKpis(r.data)
//     })
// fetchMonthlyTrend().then(
//     r=>{setTrend(r.data)})
// fetchPlatforms().then(r=>setPlatform(r.data))
// fetchAlerts().then(r=>setAlerts(r.data))
// fetchMonthDuration().then(r=>setDuration(r.data))
// },[])

// return(

// <div className="p-8 space-y-8 bg-[#020617] min-h-screen">

// <AlertsSlider alerts={alerts}/>

// <KPIGrid data={kpis}/>

// <TrendChart countData={trend} durationData={duration}/>

// <div className="grid grid-cols-2 gap-6">

// <PlatformPie data={platform} onSelect={handlePlatformClick}/>

// <ChannelBar channels={channels} types={types}
// users={users} platform={selectedPlatform} />

// </div>

// </div>

// )

// }

"use client";

import { useEffect, useState } from "react";

import KPIGrid from "../components/KPIGrid";
import TrendChart from "../components/TrendChart";
import PlatformPie from "../components/PlatformPie";
import ChannelBar from "../components/ChannelBar";
import AlertsSlider from "../components/AlertSlider";

import {
  fetchKPIs,
  fetchMonthlyTrend,
  fetchMonthDuration,
  fetchPlatforms,
  fetchChannels,
  fetchAlerts,
} from "@/services/api";

type KPI = {
  uploaded: number;
  published: number;
  created: number;
  published_rate: number;
};

export default function DashboardPage() {
  const [kpis, setKpis] = useState<KPI | null>(null);
  const [trend, setTrend] = useState([]);
  const [platform, setPlatform] = useState([]);
  const [channels, setChannels] = useState([]);
  const [types, setTypes] = useState([]);
  const [users, setUsers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [duration, setDuration] = useState([]);

  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [barColor, setBarColor] = useState("#6366f1");

  const handlePlatformClick = async (selection: any) => {
     const platformName =
      typeof selection === "string"
        ? selection
        : selection?.platform || selection?.name || "";
    const color = selection?.color || "#6366f1";

    if (!platformName) return;

    setSelectedPlatform(platformName);
    setBarColor(color);

    const res = await fetchChannels(platformName);

    setChannels(res.data.channels);
    setTypes(res.data.types);
    setUsers(res.data.users);
  };

  useEffect(() => {
    fetchKPIs().then((r) => {
      setKpis(r.data);
    });

    fetchMonthlyTrend().then((r) => setTrend(r.data));

    fetchPlatforms().then((r) => setPlatform(r.data));

    fetchAlerts().then((r) => setAlerts(r.data));

    fetchMonthDuration().then((r) => setDuration(r.data));
  }, []);

  return (
    <div className="p-8 space-y-8 bg-[#020617] min-h-screen">
      <AlertsSlider alerts={alerts} />

      <KPIGrid data={kpis} />

      <TrendChart countData={trend} durationData={duration} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlatformPie data={platform} onSelect={handlePlatformClick} />

        <ChannelBar
          channels={channels}
          types={types}
          users={users}
          platform={selectedPlatform}
          barColor={barColor}
        />
      </div>
    </div>
  );
}
"use client"

import {useState,useEffect} from "react"

export default function AlertsSlider({alerts}:any){

const [index,setIndex]=useState(0)

useEffect(()=>{

const timer=setInterval(()=>{

setIndex((prev)=>(prev+1)%alerts.length)

},4000)

return ()=>clearInterval(timer)

},[alerts])

if(!alerts.length)return null

return(

<div className="bg-red-900/30 border border-red-700 p-4 rounded-xl">

<p className="text-400">

⚠ {alerts[index]}

</p>

</div>

)

}
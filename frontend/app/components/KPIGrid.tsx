import KPIcard from "./KPIcard"

export default function KPIGrid({data}:any){

return(

<div className="grid grid-cols-4 gap-6">

<KPIcard title="Total Uploaded" value={data.uploaded}/>
<KPIcard title="Total Processed" value={data.processed}/>
<KPIcard title="Total Published" value={data.published}/>
<KPIcard title="Publish Rate" value={`${data.publish_rate}%`}/>

</div>

)

}
export default function KPIcard({title,value}:{title:string,value:any}){

return(

<div className="bg-[#0f172a] p-6 rounded-xl border border-slate-800">

<p className="text-slate-400 text-sm">{title}</p>

<h2 className="text-3xl font-bold text-white mt-2">
{value}
</h2>

</div>

)

}
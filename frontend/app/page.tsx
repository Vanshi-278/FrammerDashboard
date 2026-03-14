import Image from "next/image";
import Dashboard from "./dashboard/page";
import Nav from "./components/nav";

export default function Home() {
  return (<div className="bg-slate-800" >
    <Nav />
    <Dashboard />
    </div>
  );
}

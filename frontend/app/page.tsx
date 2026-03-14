
import Image from "next/image";
import Dashboard from "./dashboard/page";
import Nav from "./components/nav";


import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");
}


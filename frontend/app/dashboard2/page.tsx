
import UploadTrend from "./components2/UploadTrend"
import DurationTrend from "./components2/DurationTrend"
import TopUsers from "./components2/TopUsers"
import ChannelUsage from "./components2/ChannelUsage"
import PlatformDistribution from "./components2/PlatformDistribution"
import ChannelPlatform from "./components2/ChannelPlatformStack"
import Underused from "./components2/Underused"

export default function UsageDashboard() {

  return (
    <div className="p-8 space-y-8 bg-[#020617] min-h-screen">

      <h1 className="text-2xl font-bold text-white">
        Usage & Trends
      </h1>

      <UploadTrend />

      <DurationTrend />

      
      <TopUsers />
      <Underused />

    </div>
  )
}
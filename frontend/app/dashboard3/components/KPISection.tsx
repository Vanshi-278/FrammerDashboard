"use client";

import { KPIData } from "../../../lib/dashboard3-types";

type Props = {
  kpis: KPIData;
};

function KpiCard({
  title,
  value,
  suffix = "",
}: {
  title: string;
  value: string | number;
  suffix?: string;
}) {
  return (
    <div className="rounded-[22px] border border-[#263654] bg-gradient-to-br from-[#13213f] to-[#0f1a34] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
      <div className="text-sm font-medium text-[#94a3b8]">{title}</div>
      <div className="mt-3 text-3xl font-bold tracking-tight text-white">
        {value}
        <span className="ml-1 text-base font-medium text-[#67e8f9]">{suffix}</span>
      </div>
    </div>
  );
}

export default function KPISection({ kpis }: Props) {
  return (
    <div className="space-y-5">
      {kpis.selection && (
        <div className="rounded-2xl border border-[#29466b] bg-[#122342] px-4 py-3 text-sm text-[#67e8f9]">
          Showing KPI details for{" "}
          <span className="font-semibold text-white">{kpis.selection.value}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <KpiCard title="Publish Rate" value={kpis.publishRate} suffix="%" />
        <KpiCard
          title="Avg Publish Declaration"
          value={kpis.avgPublishingDeclaration}
          suffix="min"
        />
        <KpiCard
          title="Avg Creation Declaration"
          value={kpis.avgCreationDeclaration}
          suffix="min"
        />
        <KpiCard title="Uploaded Count" value={kpis.uploadedCount} />
        <KpiCard title="Created Count" value={kpis.createdCount} />
        <KpiCard title="Published Count" value={kpis.publishedCount} />
      </div>
    </div>
  );
}
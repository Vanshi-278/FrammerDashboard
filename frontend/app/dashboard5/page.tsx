'use client';

import { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import FilterPanel from '../components/FilterPanel';
import { usePaginatedData } from '../hooks/usePaginatedData';
import { exportToCSV } from '../utils/export';

interface VideoDetail {
  Headline: string;
  Source: string;
  Published: string;
  'Team Name': string;
  Type: string;
  'Uploaded By': string;
  'Video ID': string;
  'Published Platform': string;
  'Published URL': string;
}

interface FilterOptions {
  team_names: string[];
  types: string[];
  uploaded_by: string[];
  published_platforms: string[];
}

const TABLE_COLUMNS = [
  { key: 'Headline', label: 'Headline' },
  {
    key: 'Source',
    label: 'Source',
    render: (value: string) =>
      value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
          title={value}
        >
          Src
        </a>
      ) : (
        '-'
      ),
  },
  { key: 'Published', label: 'Published' },
  { key: 'Team Name', label: 'Team Name' },
  { key: 'Type', label: 'Type' },
  { key: 'Uploaded By', label: 'Uploaded By' },
  { key: 'Video ID', label: 'Video ID' },
  { key: 'Published Platform', label: 'Published Platform' },
  {
    key: 'Published URL',
    label: 'Published URL',
    render: (value: string) =>
      value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
          title={value}
        >
          Link
        </a>
      ) : (
        '-'
      ),
  },
];

export default function Dashboard5Page() {
  const [filters, setLocalFilters] = useState<Record<string, any>>({});
  const [page, setPage] = useState(0);
  const [triggerFetch, setTriggerFetch] = useState(0);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const { data, total, loading } = usePaginatedData<VideoDetail>({
    endpoint: '/dashboard/video-details',
    limit: 10,
    filters,
    page,
    triggerFetch,
  });

  const [dataQuality, setDataQuality] = useState<{
    total_records: number;
    fields: Array<{ field: string; total: number; missing: number; missing_pct: number; complete_pct: number }>;
  } | null>(null);
  const [loadingQuality, setLoadingQuality] = useState(true);


  // Fetch filter options on component mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [optsRes, qualityRes] = await Promise.all([
          fetch('http://localhost:8000/dashboard/filter-options'),
          fetch('http://localhost:8000/dashboard/data-quality'),
        ]);

        const options = await optsRes.json();
        const quality = await qualityRes.json();

        setFilterOptions(options);
        setDataQuality(quality);
      } catch (error) {
        console.error('Error fetching filter options or quality:', error);
      } finally {
        setLoadingOptions(false);
        setLoadingQuality(false);
      }
    };

    fetchFilterOptions();
  }, []);

  const totalPages = Math.ceil(total / 10);

  const handleFilterChange = (key: string, value: string) => {
    setPage(0);
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
    setTriggerFetch((prev) => prev + 1);
  };

  const handleReset = () => {
    setPage(0);
    setLocalFilters({});
    setTriggerFetch((prev) => prev + 1);
  };

  const handleExport = () => {
    exportToCSV(data, TABLE_COLUMNS, 'video-details.csv');
  };

  // Build filter config dynamically
  const filterConfig = [
    {
      key: 'search',
      label: 'Search',
      type: 'text' as const,
      placeholder: 'Search Headline or Video ID',
    },
    {
      key: 'published',
      label: 'Published Status',
      type: 'select' as const,
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
    },
    {
      key: 'team_name',
      label: 'Team Name',
      type: 'select' as const,
      options: filterOptions?.team_names.map((name) => ({
        label: name,
        value: name,
      })) || [],
    },
    {
      key: 'type',
      label: 'Type',
      type: 'select' as const,
      options: filterOptions?.types.map((type) => ({
        label: type,
        value: type,
      })) || [],
    },
    {
      key: 'uploaded_by',
      label: 'Uploaded By',
      type: 'select' as const,
      options: filterOptions?.uploaded_by.map((user) => ({
        label: user,
        value: user,
      })) || [],
    },
    {
      key: 'published_platform',
      label: 'Published Platform',
      type: 'select' as const,
      options: filterOptions?.published_platforms.map((platform) => ({
        label: platform,
        value: platform,
      })) || [],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Video-Level Detail / Explorer</h1>
        <p className="text-slate-400 mt-2">
          Searchable, filterable detail table with export-ready logic.
        </p>
      </div>

      <FilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        config={filterConfig}
        loading={loadingOptions}
        onReset={handleReset}
      />

      <DataTable
        columns={TABLE_COLUMNS}
        data={data}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        total={total}
        limit={10}
        onExport={handleExport}
        title="Video Details Table"
      />

      {dataQuality && (
        <div className="bg-slate-900 rounded-xl p-6 shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Data Quality</h2>
          <p className="text-slate-400 mb-4">
            Total records: <span className="font-medium text-white">{dataQuality.total_records}</span>
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="py-2 pr-4">Field</th>
                  <th className="py-2 pr-4">Missing</th>
                  <th className="py-2 pr-4">% Missing</th>
                  <th className="py-2 pr-4">% Complete</th>
                </tr>
              </thead>
              <tbody>
                {dataQuality.fields.map((field) => (
                  <tr key={field.field} className="border-b border-slate-800">
                    <td className="py-2 pr-4">{field.field}</td>
                    <td className="py-2 pr-4">{field.missing}</td>
                    <td className="py-2 pr-4">{field.missing_pct}%</td>
                    <td className="py-2 pr-4">{field.complete_pct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
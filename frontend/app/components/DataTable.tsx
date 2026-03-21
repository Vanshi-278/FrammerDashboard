'use client';

interface Column {
  key: string;
  label: string;
  render?: (value: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data?: any[]; // 👈 make optional
  loading?: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  total: number;
  limit: number;
  onExport?: () => void;
  title?: string;
}

export default function DataTable({
  columns,
  data = [], // 👈 default safe value
  loading = false,
  page,
  totalPages,
  onPageChange,
  total,
  limit,
  onExport,
  title,
}: DataTableProps) {

  const safeData = Array.isArray(data) ? data : []; // 👈 double safety

  return (
    <div className="bg-slate-900 rounded-xl p-6 shadow overflow-x-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        {title && <h2 className="text-xl font-semibold">{title}</h2>}
        {onExport && (
          <button
            onClick={onExport}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Export to CSV
          </button>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : (
        <>
          <table className="w-full text-left border-collapse">

            {/* Table Head */}
            <thead>
              <tr className="border-b border-slate-700 text-slate-400">
                {columns.map((col) => (
                  <th key={col.key} className="py-3 pr-4">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {safeData.length > 0 ? (
                safeData.map((row, index) => (
                  <tr key={index} className="border-b border-slate-800">
                    {columns.map((col) => (
                      <td key={`${index}-${col.key}`} className="py-3 pr-4">
                        {col.render
                          ? col.render(row[col.key])
                          : row[col.key] ?? '-'}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-4 text-center text-slate-400"
                  >
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-slate-400">
              {total > 0
                ? `Showing ${page * limit + 1} to ${Math.min(
                    (page + 1) * limit,
                    total
                  )} of ${total} entries`
                : 'No entries'}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => onPageChange(Math.max(0, page - 1))}
                disabled={page === 0}
                className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white px-3 py-1 rounded"
              >
                Previous
              </button>

              <button
                onClick={() =>
                  onPageChange(Math.min(totalPages - 1, page + 1))
                }
                disabled={page >= totalPages - 1}
                className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white px-3 py-1 rounded"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
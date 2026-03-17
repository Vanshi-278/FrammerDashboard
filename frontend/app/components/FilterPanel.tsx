'use client';

interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select';
  placeholder?: string;
  options?: { label: string; value: string }[];
}

interface FilterPanelProps {
  filters: Record<string, any>;
  onFilterChange: (key: string, value: string) => void;
  config: FilterConfig[];
  loading?: boolean;
  onReset?: () => void;
}

export default function FilterPanel({
  filters,
  onFilterChange,
  config,
  loading = false,
  onReset,
}: FilterPanelProps) {
  return (
    <div className="bg-slate-900 rounded-xl p-6 shadow mb-8">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>
      {loading ? (
        <p className="text-slate-400">Loading filter options...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {config.map((field) => (
              <div key={field.key}>
                {field.type === 'text' && !field.options ? (
                  <input
                    type="text"
                    placeholder={field.placeholder || field.label}
                    value={filters[field.key] || ''}
                    onChange={(e) => onFilterChange(field.key, e.target.value)}
                    className="w-full bg-slate-800 text-white p-2 rounded"
                  />
                ) : (
                  <select
                    value={filters[field.key] || ''}
                    onChange={(e) => onFilterChange(field.key, e.target.value)}
                    className="w-full bg-slate-800 text-white p-2 rounded"
                  >
                    <option value="">{`All ${field.label}`}</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
          {onReset && (
            <div className="mt-4">
              <button
                onClick={onReset}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Reset Filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

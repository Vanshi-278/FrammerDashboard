import { useState, useEffect, useCallback } from 'react';

interface UsePaginatedDataOptions {
  endpoint: string;
  limit?: number;
  filters?: Record<string, any>;
  page?: number;
  triggerFetch?: number;
}

interface UsePaginatedDataReturn<T> {
  data: T[];
  total: number;
  loading: boolean;
}

export function usePaginatedData<T>(
  options: UsePaginatedDataOptions
): UsePaginatedDataReturn<T> {
  const { endpoint, limit = 50, filters = {}, page = 0, triggerFetch = 0 } = options;
  
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const params = new URLSearchParams();

      // Add filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '') {
          params.append(key, String(value));
        }
      });

      params.append('limit', limit.toString());
      params.append('offset', (page * limit).toString());

      try {
        const url = `http://localhost:8000${endpoint}?${params}`;
        const response = await fetch(url);
        const result = await response.json();

        // Debug: log if the API returns no data
        if (Array.isArray(result.data) && result.data.length === 0) {
          console.log('usePaginatedData: empty result', { url, result });
        }

        setData(result.data);
        setTotal(result.total);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, filters, page, limit, triggerFetch]);

  return {
    data,
    total,
    loading,
  };
}

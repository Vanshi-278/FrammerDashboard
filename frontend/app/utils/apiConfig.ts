/**
 * Get the API base URL based on the environment
 * - On localhost: uses http://localhost:8000
 * - On deployed: uses same domain with port 8000 (e.g., https://example.com:8000)
 * - Can be overridden with NEXT_PUBLIC_API_URL environment variable
 */
export const getApiUrl = (): string => {
  // Check for explicit environment variable first
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Client-side only (window object exists)
  if (typeof window !== 'undefined') {
    // On localhost, use http://localhost:8000
    if (window.location.hostname === 'localhost') {
      return 'http://localhost:8000';
    }

    // On production, construct URL from current hostname
    // e.g., https://example.com:8000
    return `${window.location.protocol}//${window.location.hostname}:8000`;
  }

  // Server-side fallback
  return 'http://localhost:8000';
};

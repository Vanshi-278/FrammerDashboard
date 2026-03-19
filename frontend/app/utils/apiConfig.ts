/**
 * Get the API base URL based on the environment
 * - On localhost: uses http://localhost:8000
 * - On production: uses Vercel backend (https://backendframmerai.vercel.app)
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

    // On production, use deployed Vercel backend
    return 'https://backendframmerai.vercel.app';
  }

  // Server-side fallback
  return 'http://localhost:8000';
};

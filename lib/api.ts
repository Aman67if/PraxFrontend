/**
 * Central API configuration.
 * All fetch calls should use `API_URL` instead of hardcoding the backend URL.
 * 
 * Set the value in `.env.local`:
 *   NEXT_PUBLIC_API_URL=http://localhost:5000/api
 */
export const API_URL = process.env.NEXT_API_URL || "http://localhost:5000/api";

/**
 * A wrapper around the native fetch API that automatically adds:
 * 1. credentials: "include" (for cross-origin cookies)
 * 2. ngrok-skip-browser-warning header (to bypass ngrok's free tier warning page on GET requests)
 */
export async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const customInit: RequestInit = {
    ...init,
    credentials: init?.credentials || "include",
    headers: {
      ...init?.headers,
      "ngrok-skip-browser-warning": "true",
    },
  };
  return fetch(input, customInit);
}

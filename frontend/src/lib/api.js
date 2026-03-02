export const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || `${BASE_URL}/api`;

export async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
  });

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return response.json();
}

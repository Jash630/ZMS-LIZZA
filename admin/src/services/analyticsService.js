import { apiRequest } from '../lib/apiClient'

export const analyticsService = {
  dashboard: () => apiRequest('/analytics/dashboard'),
  overview: (months = 9) => apiRequest('/analytics/overview', { query: { months } }),
}

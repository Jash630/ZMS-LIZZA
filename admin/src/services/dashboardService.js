import { apiRequest } from '../lib/apiClient'

export const dashboardService = {
  getDashboard: () => apiRequest('/analytics/dashboard'),
  getOverview: (months = 9) => apiRequest('/analytics/overview', { query: { months } }),
}

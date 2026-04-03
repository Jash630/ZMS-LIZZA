import { apiRequest } from '../lib/apiClient'

export const leadsService = {
  list: (query = {}) => apiRequest('/leads', { query }),
  getStats: () => apiRequest('/leads/stats'),
  create: (payload) => apiRequest('/leads', { method: 'POST', body: payload }),
  update: (id, payload) => apiRequest(`/leads/${id}`, { method: 'PUT', body: payload }),
  remove: (id) => apiRequest(`/leads/${id}`, { method: 'DELETE' }),
}

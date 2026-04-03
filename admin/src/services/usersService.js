import { apiRequest } from '../lib/apiClient'

export const usersService = {
  list: (query = {}) => apiRequest('/users', { query }),
  create: (payload) => apiRequest('/users', { method: 'POST', body: payload }),
  update: (id, payload) => apiRequest(`/users/${id}`, { method: 'PUT', body: payload }),
  remove: (id) => apiRequest(`/users/${id}`, { method: 'DELETE' }),
}

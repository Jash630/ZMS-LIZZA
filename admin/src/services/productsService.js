import { apiRequest } from '../lib/apiClient'

export const productsService = {
  list: (query = {}) => apiRequest('/products', { query }),
  get: (id) => apiRequest(`/products/${id}`),
  create: (payload) => apiRequest('/products', { method: 'POST', body: payload }),
  update: (id, payload) => apiRequest(`/products/${id}`, { method: 'PUT', body: payload }),
  remove: (id) => apiRequest(`/products/${id}`, { method: 'DELETE' }),
  stats: () => apiRequest('/products/stats'),
}

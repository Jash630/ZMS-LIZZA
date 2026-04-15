import { apiRequest } from '../lib/apiClient'

export const subscribersService = {
  list: (query = {}) => apiRequest('/subscribers', { query }),
  getStats: () => apiRequest('/subscribers/stats'),
  update: (id, payload) => apiRequest(`/subscribers/${id}`, { method: 'PUT', body: payload }),
  remove: (id) => apiRequest(`/subscribers/${id}`, { method: 'DELETE' }),
  sendOffer: (payload) => apiRequest('/subscribers/send-offer', { method: 'POST', body: payload }),
}


import { apiRequest } from '../lib/apiClient'

export const postsService = {
  list: (query = {}) => apiRequest('/posts', { query }),
  create: (payload) => apiRequest('/posts', { method: 'POST', body: payload }),
  update: (id, payload) => apiRequest(`/posts/${id}`, { method: 'PUT', body: payload }),
  remove: (id) => apiRequest(`/posts/${id}`, { method: 'DELETE' }),
}

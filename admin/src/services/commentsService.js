import { apiRequest } from '../lib/apiClient'

export const commentsService = {
  list: (query = {}) => apiRequest('/comments', { query }),
  updateStatus: (id, status) =>
    apiRequest(`/comments/${id}/status`, {
      method: 'PUT',
      body: { status },
    }),
  remove: (id) => apiRequest(`/comments/${id}`, { method: 'DELETE' }),
}

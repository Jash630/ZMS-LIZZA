import { apiRequest } from '../lib/apiClient'

export const notificationsService = {
  list: (query = {}) => apiRequest('/notifications', { query }),
  markAsRead: (id) => apiRequest(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllAsRead: () => apiRequest('/notifications/read-all', { method: 'PUT' }),
  remove: (id) => apiRequest(`/notifications/${id}`, { method: 'DELETE' }),
}

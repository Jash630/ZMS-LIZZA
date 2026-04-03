import { apiRequest } from '../lib/apiClient'

export const settingsService = {
  get: () => apiRequest('/settings'),
  updateGeneral: (payload) => apiRequest('/settings/general', { method: 'PUT', body: payload }),
  updateAppearance: (payload) => apiRequest('/settings/appearance', { method: 'PUT', body: payload }),
  updateNotifications: (payload) =>
    apiRequest('/settings/notifications', { method: 'PUT', body: payload }),
}

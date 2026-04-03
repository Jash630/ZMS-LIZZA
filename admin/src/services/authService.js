import { apiRequest } from '../lib/apiClient'

export const authService = {
  login: (email, password) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password },
      skipAuth: true,
      skipUnauthorizedHandler: true,
    }),

  getMe: () => apiRequest('/auth/me'),

  logout: () => apiRequest('/auth/logout', { method: 'POST' }),

  updatePassword: (currentPassword, newPassword) =>
    apiRequest('/auth/update-password', {
      method: 'PUT',
      body: { currentPassword, newPassword },
    }),
}

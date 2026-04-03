import { apiRequest } from '../lib/apiClient'

export const seoService = {
  get: () => apiRequest('/seo'),
  update: (payload) => apiRequest('/seo', { method: 'PUT', body: payload }),
  updateKeywords: (keywords) =>
    apiRequest('/seo/keywords', {
      method: 'PUT',
      body: { keywords },
    }),
}

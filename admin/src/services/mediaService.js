import { apiRequest } from '../lib/apiClient'

export const mediaService = {
  list: (query = {}) => apiRequest('/media', { query }),
  upload: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiRequest('/media/upload', {
      method: 'POST',
      body: formData,
      isFormData: true,
    })
  },
  remove: (id) => apiRequest(`/media/${id}`, { method: 'DELETE' }),
}

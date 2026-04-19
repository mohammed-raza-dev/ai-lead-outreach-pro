import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

export const leadsAPI = {
  getAll: () => api.get('/leads/'),
  create: (data) => api.post('/leads/', data),
  delete: (id) => api.delete(`/leads/${id}`),
  uploadCSV: (file) => {
    const fd = new FormData()
    fd.append('file', file)
    return api.post('/leads/upload-csv', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  getStats: () => api.get('/leads/stats'),
}

export const messagesAPI = {
  generate: (data) => api.post('/messages/generate', data),
  generateBulk: (data) => api.post('/messages/bulk', data),
  getAll: (type) => api.get('/messages/', { params: type ? { message_type: type } : {} }),
  exportCSV: () => window.open('/api/messages/export-csv', '_blank'),
}

export const scraperAPI = {
  apollo: (data) => api.post('/scrape/apollo', data),
  hunter: (data) => api.post('/scrape/hunter', data),
  web: (data) => api.post('/scrape/web', data),
}

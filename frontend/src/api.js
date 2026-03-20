import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const featureApi = {
  getAll: (status) => api.get('/features', { params: status ? { status } : {} }),
  getOne: (id) => api.get(`/features/${id}`),
  create: (data) => api.post('/features', data),
  update: (id, data) => api.put(`/features/${id}`, data),
  updateStatus: (id, status) => api.patch(`/features/${id}/status`, { status }),
  delete: (id) => api.delete(`/features/${id}`),
};

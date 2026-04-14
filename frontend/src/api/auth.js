import api from './api';

export const register = (userData) => api.post('/auth/register/', userData);
export const login = (credentials) => api.post('/auth/login/', credentials);
export const logout = (refreshToken) => api.post('/auth/logout/', { refresh: refreshToken });
export const getProfile = () => api.get('/auth/profile/');
export const updateProfile = (userData) => api.put('/auth/profile/', userData);
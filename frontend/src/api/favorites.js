import api from './api';

export const getFavorites = () => api.get('/favorites/');
export const addToFavorites = (productId) => api.post('/favorites/', { product: productId });
export const removeFromFavorites = (productId) => api.delete(`/favorites/${productId}/`);
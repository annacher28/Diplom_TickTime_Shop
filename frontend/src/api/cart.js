import api from './api';

export const getCart = () => api.get('/cart/');
export const addToCart = (productId, quantity = 1) => api.post('/cart/', { product: productId, quantity });
export const updateCartItem = (itemId, quantity) => api.patch(`/cart/${itemId}/`, { quantity });
export const removeFromCart = (itemId) => api.delete(`/cart/${itemId}/`);
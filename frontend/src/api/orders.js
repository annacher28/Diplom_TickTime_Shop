import api from './api';

export const getOrders = () => api.get('/orders/');
export const getOrder = (id) => api.get(`/orders/${id}/`);
export const createOrder = (orderData) => api.post('/orders/', orderData);
export const updateOrderStatus = (orderId, status) => api.patch(`/orders/${orderId}/update_status/`, { status });
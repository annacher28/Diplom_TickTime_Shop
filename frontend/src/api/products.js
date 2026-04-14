import api from './api';

// GET – без изменений
export const getProducts = () => api.get('/products/');
export const getProduct = (id) => api.get(`/products/${id}/`);

// POST с изображением – используем FormData
export const createProduct = (productData) => {
    const formData = new FormData();
    for (const key in productData) {
        if (productData[key] !== undefined && productData[key] !== null) {
            formData.append(key, productData[key]);
        }
    }
    return api.post('/products/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

// PUT с изображением – тоже FormData
export const updateProduct = (id, productData) => {
    const formData = new FormData();
    for (const key in productData) {
        if (productData[key] !== undefined && productData[key] !== null) {
            formData.append(key, productData[key]);
        }
    }
    // Для PUT-запроса с FormData некоторые бэкенды ожидают метод POST с _method=PUT
    // Django DRF поддерживает PUT через multipart/form-data, если указать метод PUT
    return api.put(`/products/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

export const deleteProduct = (id) => api.delete(`/products/${id}/`);
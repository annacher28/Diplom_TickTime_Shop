import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as productsApi from '../api/products';
import * as cartApi from '../api/cart';
import { useAuth } from '../contexts/AuthContext';

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await productsApi.getProduct(id);
                setProduct(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const addToCart = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        try {
            await cartApi.addToCart(product.id, quantity);
            alert('Товар добавлен в корзину');
        } catch (err) {
            console.error(err);
            alert('Ошибка добавления');
        }
    };

    if (loading) return <div className="text-center py-16">Загрузка...</div>;
    if (!product) return <div className="text-center py-16">Товар не найден</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-8 p-6">
                        <div className="flex justify-center">
                            {product.image ? (
                                <img src={`${product.image}`} alt={product.name} className="w-full max-w-md object-cover rounded-lg" />
                            ) : (
                                <div className="w-full max-w-md h-96 bg-gray-200 flex items-center justify-center rounded-lg">Нет фото</div>
                            )}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                            <p className="text-gray-600 mb-6">{product.description}</p>
                            <div className="text-3xl font-bold text-amber-600 mb-4">{product.price} ₽</div>
                            <div className="mb-4">На складе: {product.stock} шт.</div>
                            <div className="flex items-center gap-4 mb-6">
                                <label className="font-medium">Количество:</label>
                                <input type="number" min="1" max={product.stock} value={quantity} onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))} className="w-20 px-3 py-2 border border-gray-300 rounded-md text-center" />
                            </div>
                            <button onClick={addToCart} className="w-full md:w-auto bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3 rounded-lg transition">Добавить в корзину</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
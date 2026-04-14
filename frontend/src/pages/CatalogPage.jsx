import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as productsApi from '../api/products';
import * as favoritesApi from '../api/favorites';
import { useAuth } from '../contexts/AuthContext';

const CatalogPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState(new Set());
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        fetchProducts();
        if (isAuthenticated) fetchFavorites();
    }, [isAuthenticated]);

    const fetchProducts = async () => {
        try {
            const res = await productsApi.getProducts();
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchFavorites = async () => {
        try {
            const res = await favoritesApi.getFavorites();
            setFavorites(new Set(res.data.map(f => f.product)));
        } catch (err) {
            console.error(err);
        }
    };

    const toggleFavorite = async (productId) => {
        if (!isAuthenticated) {
            alert('Войдите, чтобы добавлять в избранное');
            return;
        }
        try {
            if (favorites.has(productId)) {
                await favoritesApi.removeFromFavorites(productId);
                setFavorites(prev => { const s = new Set(prev); s.delete(productId); return s; });
            } else {
                await favoritesApi.addToFavorites(productId);
                setFavorites(prev => new Set(prev).add(productId));
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="text-center py-16">Загрузка товаров...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">Каталог часов</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map(product => (
                        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                            <Link to={`/product/${product.id}`}>
                                <div className="h-64 bg-gray-200 flex items-center justify-center">
                                    {product.image ? (
                                        <img src={`${product.image}`} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-gray-400">Нет фото</span>
                                    )}
                                </div>
                            </Link>
                            <div className="p-4">
                                <Link to={`/product/${product.id}`}>
                                    <h2 className="text-xl font-semibold mb-2 hover:text-amber-600">{product.name}</h2>
                                </Link>
                                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-2xl font-bold text-amber-600">{product.price} ₽</span>
                                    <button onClick={() => toggleFavorite(product.id)} className={`p-2 rounded-full transition ${favorites.has(product.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}>
                                        <svg className="w-6 h-6" fill={favorites.has(product.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CatalogPage;
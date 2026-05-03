import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as favoritesApi from '../api/favorites';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { formatPrice } from '../utils/formatPrice';

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();
    const { addItem } = useCart();
    const { addToast } = useToast();

    useEffect(() => {
        if (isAuthenticated) fetchFavorites();
    }, [isAuthenticated]);

    const fetchFavorites = async () => {
        try {
            const res = await favoritesApi.getFavorites();
            setFavorites(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = async (productId) => {
        try {
            await favoritesApi.removeFromFavorites(productId);
            setFavorites(prev => prev.filter(f => f.product !== productId));
            addToast('Товар удален из избранного', 'info');
        } catch (err) {
            console.error(err);
            addToast('Ошибка удаления из избранного', 'error');
        }
    };

    const addToCartFromFavorite = async (productId) => {
        try {
            await addItem(productId, 1);
            addToast('Товар добавлен в корзину', 'success');
        } catch (err) {
            console.error(err);
            addToast('Ошибка добавления в корзину', 'error');
        }
    };

    if (loading) return <div className="text-center py-16">Загрузка...</div>;
    if (favorites.length === 0) return <div className="text-center py-16">Избранное пусто</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">Избранное</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {favorites.map(fav => (
                        <div key={fav.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                            <Link to={`/product/${fav.product}`} className="block">
                                <div className="h-64 bg-gray-200 flex items-center justify-center">
                                    {fav.product_detail?.image ? (
                                        <img src={`${fav.product_detail.image}`} className="w-full h-full object-cover" alt={fav.product_detail.name} />
                                    ) : (
                                        <span>Нет фото</span>
                                    )}
                                </div>
                            </Link>
                            <div className="p-4 flex flex-col flex-grow">
                                <Link to={`/product/${fav.product}`}>
                                    <h2 className="text-xl font-semibold hover:text-gray-700 transition">{fav.product_detail?.name}</h2>
                                </Link>
                                <p className="text-2xl font-bold text-gray-800 mt-5">{formatPrice(fav.product_detail?.price)} ₽</p>
                                <div className="mt-6 flex justify-between items-center">
                                    <button
                                        onClick={() => addToCartFromFavorite(fav.product)}
                                        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition text-sm"
                                    >
                                        В корзину
                                    </button>
                                    <button
                                        onClick={() => removeFavorite(fav.product)}
                                        className="w-8 h-8 border border-red-300 rounded-md hover:bg-red-50 transition flex items-center justify-center text-red-500 hover:text-red-700"
                                        title="Удалить из избранного"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

export default FavoritesPage;
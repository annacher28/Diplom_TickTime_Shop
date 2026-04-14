import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as favoritesApi from '../api/favorites';
import { useAuth } from '../contexts/AuthContext';

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();

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
        } catch (err) {
            console.error(err);
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
                        <div key={fav.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <Link to={`/product/${fav.product}`}>
                                <div className="h-64 bg-gray-200 flex items-center justify-center">
                                    {fav.product_detail?.image ? <img src={`${fav.product_detail.image}`} className="w-full h-full object-cover" /> : <span>Нет фото</span>}
                                </div>
                            </Link>
                            <div className="p-4">
                                <Link to={`/product/${fav.product}`}><h2 className="text-xl font-semibold">{fav.product_detail?.name}</h2></Link>
                                <p className="text-2xl font-bold text-gray-700 mt-5">{fav.product_detail?.price} ₽</p>
                                <button onClick={() => removeFavorite(fav.product)} className="mt-6 text-red-600">Удалить из избранного</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FavoritesPage;
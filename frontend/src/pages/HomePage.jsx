import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="relative bg-gray-900 text-white">
                <div className="relative container mx-auto px-4 py-32 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">TickTime</h1>
                    <p className="text-xl md:text-2xl mb-8">Изысканные наручные часы для ценителей времени</p>
                    <Link to="/catalog" className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3 rounded-lg transition">Смотреть каталог</Link>
                </div>
            </div>
            <div className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-center mb-12">Почему выбирают TickTime?</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center p-6"><div className="text-4xl mb-4">⌚</div><h3 className="text-xl font-semibold mb-2">Швейцарское качество</h3><p className="text-gray-600">Точные механизмы и лучшие материалы</p></div>
                    <div className="text-center p-6"><div className="text-4xl mb-4">🚚</div><h3 className="text-xl font-semibold mb-2">Бесплатная доставка</h3><p className="text-gray-600">По всей России от 5000₽</p></div>
                    <div className="text-center p-6"><div className="text-4xl mb-4">🔒</div><h3 className="text-xl font-semibold mb-2">Гарантия 2 года</h3><p className="text-gray-600">Официальная гарантия от производителя</p></div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
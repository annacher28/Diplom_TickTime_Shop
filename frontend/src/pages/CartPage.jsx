// src/pages/CartPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import * as ordersApi from '../api/orders';
import { formatPrice } from '../utils/formatPrice';

const CartPage = () => {
    const { cartItems, updateItem, removeItem, getCartTotal, refreshCart } = useCart();
    const { isAuthenticated } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [address, setAddress] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Изменение количества товара
    const handleQuantityChange = async (itemId, currentQuantity, delta) => {
        const newQuantity = currentQuantity + delta;
        if (newQuantity < 1) return;
        try {
            await updateItem(itemId, newQuantity);
            addToast('Количество товара изменено', 'info');
        } catch (err) {
            console.error(err);
            addToast('Ошибка изменения количества', 'error');
        }
    };

    // Удаление товара из корзины
    const handleRemoveItem = async (itemId) => {
        try {
            await removeItem(itemId);
            addToast('Товар удалён из корзины', 'info');
        } catch (err) {
            console.error(err);
            addToast('Ошибка удаления товара', 'error');
        }
    };

    // Оформление заказа
    const handleCheckout = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            addToast('Войдите, чтобы оформить заказ', 'error');
            return;
        }
        if (!address.trim()) {
            addToast('Пожалуйста, укажите адрес доставки', 'error');
            return;
        }
        setIsProcessing(true);
        try {
            await ordersApi.createOrder({ delivery_address: address });
            addToast('Заказ успешно оформлен!', 'success');
            setAddress('');
            await refreshCart(); // обновляем корзину после заказа
            navigate('/profile');
        } catch (error) {
            console.error(error);
            addToast('Ошибка при оформлении заказа. Попробуйте позже.', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    // Если корзина пуста – показываем сообщение
    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🛒</div>
                    <h2 className="text-2xl font-semibold mb-2 text-gray-800">Ваша корзина пуста</h2>
                    <p className="text-gray-600 mb-6">Добавьте товары из каталога, чтобы оформить заказ</p>
                    <Link
                        to="/catalog"
                        className="inline-block bg-gray-800 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition"
                    >
                        Перейти в каталог
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8 text-gray-900">Корзина</h1>
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Список товаров */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex gap-4">
                                {/* Изображение */}
                                <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
                                    {item.product_detail?.image ? (
                                        <img
                                            src={`${item.product_detail.image}`}
                                            alt={item.product_detail.name}
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                    ) : (
                                        <span className="text-gray-400 text-xs">Нет фото</span>
                                    )}
                                </div>
                                {/* Информация о товаре */}
                                <div className="flex-grow">
                                    <Link
                                        to={`/product/${item.product}`}
                                        className="text-lg font-semibold hover:text-gray-700 transition text-gray-800"
                                    >
                                        {item.product_detail?.name}
                                    </Link>
                                    <p className="text-gray-600 font-bold mt-1">
                                        {formatPrice(item.product_detail?.price)} ₽
                                    </p>
                                    <div className="flex items-center gap-3 mt-2">
                                        {/* Кнопка уменьшения количества */}
                                        <button
                                            onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                            className="w-8 h-8 border border-gray-300 rounded-md hover:bg-gray-100 transition flex items-center justify-center text-gray-700"
                                        >
                                            -
                                        </button>
                                        <span className="w-12 text-center text-gray-800">{item.quantity}</span>
                                        {/* Кнопка увеличения количества */}
                                        <button
                                            onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                                            className="w-8 h-8 border border-gray-300 rounded-md hover:bg-gray-100 transition flex items-center justify-center text-gray-700"
                                        >
                                            +
                                        </button>
                                        {/* Кнопка удаления (мусорное ведро) */}
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="w-8 h-8 border border-red-300 rounded-md hover:bg-red-50 transition flex items-center justify-center text-red-500 hover:text-red-700"
                                            title="Удалить из корзины"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                {/* Сумма за этот товар */}
                                <div className="text-right">
                                    <p className="text-xl font-bold text-gray-800">{formatPrice(item.total)} ₽</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Блок оформления заказа */}
                    <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Итого</h2>
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-gray-600">
                                <span>
                                    Товары ({cartItems.reduce((sum, i) => sum + i.quantity, 0)} шт.):
                                </span>
                                <span>{formatPrice(getCartTotal())} ₽</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                                <span className="text-gray-900">К оплате:</span>
                                <span className="text-gray-900">{formatPrice(getCartTotal())} ₽</span>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Адрес доставки
                            </label>
                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                                placeholder="Введите ваш адрес для доставки"
                                required
                            />
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={isProcessing}
                            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
                        >
                            {isProcessing ? 'Оформление...' : 'Оформить заказ'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
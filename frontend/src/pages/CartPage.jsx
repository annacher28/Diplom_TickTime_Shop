
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import * as ordersApi from '../api/orders';

const CartPage = () => {
    const { cartItems, updateItem, removeItem, getCartTotal, refreshCart } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [address, setAddress] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // При монтировании страницы и при изменении isAuthenticated обновляем корзину
    useEffect(() => {
        if (isAuthenticated) {
            refreshCart();
        }
    }, [isAuthenticated, refreshCart]);

    const handleQuantityChange = (itemId, currentQuantity, delta) => {
        const newQuantity = currentQuantity + delta;
        if (newQuantity < 1) return;
        updateItem(itemId, newQuantity);
    };

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (!address.trim()) {
            alert('Пожалуйста, укажите адрес доставки');
            return;
        }
        setIsProcessing(true);
        try {
            await ordersApi.createOrder({ delivery_address: address });
            alert('Заказ успешно оформлен!');
            setAddress('');
            await refreshCart();
            navigate('/profile');
        } catch (error) {
            console.error('Failed to create order:', error);
            alert('Ошибка при оформлении заказа. Попробуйте позже.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🛒</div>
                    <h2 className="text-2xl font-semibold mb-2">Ваша корзина пуста</h2>
                    <p className="text-gray-600 mb-6">Добавьте товары из каталога, чтобы оформить заказ</p>
                    <Link to="/catalog" className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3 rounded-lg transition">
                        Перейти в каталог
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">Корзина</h1>
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex gap-4">
                                <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
                                    {item.product_detail?.image ? (
                                        <img src={`${item.product_detail.image}`} alt={item.product_detail.name} className="w-full h-full object-cover rounded-md" />
                                    ) : (
                                        <span className="text-gray-400 text-xs">Нет фото</span>
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <Link to={`/product/${item.product}`} className="text-lg font-semibold hover:text-amber-600 transition">
                                        {item.product_detail?.name}
                                    </Link>
                                    <p className="text-amber-600 font-bold mt-1">{item.product_detail?.price} ₽</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <button
                                            onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                            className="w-8 h-8 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                                        >
                                            -
                                        </button>
                                        <span className="w-12 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                                            className="w-8 h-8 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                                        >
                                            +
                                        </button>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="ml-4 text-red-500 hover:text-red-700 transition"
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold">{item.total} ₽</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 h-fit">
                        <h2 className="text-xl font-semibold mb-4">Итого</h2>
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span>Товары ({cartItems.reduce((sum, i) => sum + i.quantity, 0)} шт.):</span>
                                <span>{getCartTotal().toFixed(2)} ₽</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                <span>К оплате:</span>
                                <span className="text-amber-600">{getCartTotal().toFixed(2)} ₽</span>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Адрес доставки</label>
                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                                placeholder="Введите ваш адрес для доставки"
                                required
                            />
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={isProcessing}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
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

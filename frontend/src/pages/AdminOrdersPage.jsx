// src/pages/AdminOrdersPage.jsx
import React, { useState, useEffect } from 'react';
import * as ordersApi from '../api/orders';

// Маппинг статусов для прогресс-бара (индекс = шаг)
const STATUS_STEPS = ['pending', 'paid', 'shipped', 'delivered'];
const STEP_NAMES = {
    pending: 'Создан',
    paid: 'Оплачен',
    shipped: 'Отправлен',
    delivered: 'Доставлен'
};

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tempStatus, setTempStatus] = useState({});

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await ordersApi.getOrders();
            setOrders(res.data);
            const initial = {};
            res.data.forEach(order => {
                initial[order.id] = order.status;
            });
            setTempStatus(initial);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (orderId, newStatus) => {
        setTempStatus(prev => ({ ...prev, [orderId]: newStatus }));
    };

    const updateStatus = async (orderId) => {
        const newStatus = tempStatus[orderId];
        try {
            await ordersApi.updateOrderStatus(orderId, newStatus);
            await fetchOrders();
        } catch (err) {
            console.error(err);
            alert('Ошибка обновления статуса');
        }
    };

    // Функция для вычисления ширины активной линии (в процентах)
    const getProgressWidth = (currentStatus) => {
        const currentIndex = STATUS_STEPS.indexOf(currentStatus);
        if (currentIndex === -1) return 0;
        // Процент = (текущий индекс) / (всего шагов - 1) * 100
        return (currentIndex / (STATUS_STEPS.length - 1)) * 100;
    };

    const getStatusLabel = (status) => {
        const labels = {
            pending: 'Создан',
            paid: 'Оплачен',
            shipped: 'Отправлен',
            delivered: 'Доставлен',
            cancelled: 'Отменён'
        };
        return labels[status] || status;
    };

    if (loading) return <div className="text-center py-16">Загрузка заказов...</div>;

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-bold mb-8">Управление заказами</h1>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                        Заказов пока нет
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map(order => {
                            const isCancelled = order.status === 'cancelled';
                            const currentStepIndex = STATUS_STEPS.indexOf(order.status);
                            const progressWidth = getProgressWidth(order.status);

                            return (
                                <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                    {/* Шапка с ID заказа (тёмно-синяя) */}
                                    <div className="bg-gray-800 px-6 py-4">
                                        <h2 className="text-xl font-semibold text-white">
                                            Заказ {order.id}
                                        </h2>
                                    </div>

                                    <div className="p-6">
                                        {/* Блок изменения статуса */}
                                        <div className="mb-8">
                                            <h3 className="text-md font-medium text-gray-700 mb-3">
                                                Изменить статус заказа
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-4">
                                                <select
                                                    value={tempStatus[order.id] || order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="pending">Создан</option>
                                                    <option value="paid">Оплачен</option>
                                                    <option value="shipped">Отправлен</option>
                                                    <option value="delivered">Доставлен</option>
                                                    <option value="cancelled">Отменён</option>
                                                </select>
                                                <button
                                                    onClick={() => updateStatus(order.id)}
                                                    className="bg-gray-800 hover:bg-gray-900 text-white font-medium px-4 py-2 rounded-md transition"
                                                >
                                                    Изменить
                                                </button>
                                            </div>
                                        </div>

                                        {/* Визуальный индикатор статуса (линия с кружками) */}
                                        {!isCancelled ? (
                                            <div className="mb-8">
                                                <div className="relative flex justify-between items-center">
                                                    {/* Фоновая линия (серая) */}
                                                    <div className="absolute left-0 right-0 h-1 bg-gray-200 rounded-full" />
                                                    {/* Активная линия (синяя) – анимированная ширина */}
                                                    <div
                                                        className="absolute left-0 h-1 bg-[#5B88B2] rounded-full transition-all duration-700 ease-in-out"
                                                        style={{ width: `${progressWidth}%` }}
                                                    />
                                                    {/* Кружки этапов */}
                                                    {STATUS_STEPS.map((step, idx) => {
                                                        const isActive = currentStepIndex >= idx;
                                                        return (
                                                            <div key={step} className="relative flex flex-col items-center">
                                                                <div
                                                                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors duration-300 z-10 bg-white
                                                                        ${isActive ? 'border-[#5B88B2] text-[#5B88B2]' : 'border-gray-300 text-gray-400'}`}
                                                                >
                                                                    {idx + 1}
                                                                </div>
                                                                <span className="absolute top-10 text-xs text-center text-gray-600 whitespace-nowrap hidden sm:block">
                                                                    {STEP_NAMES[step]}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                {/* Подписи для мобильных (если нужно) – можно оставить так */}
                                                <div className="flex justify-between mt-8 text-xs text-gray-500 sm:hidden">
                                                    {STATUS_STEPS.map(step => (
                                                        <span key={step}>{STEP_NAMES[step]}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mb-8 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-center">
                                                Заказ отменён
                                            </div>
                                        )}

                                        {/* Список товаров */}
                                        <div className="mb-6">
                                            {order.items && order.items.map(item => (
                                                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                                    <div>
                                                        <p className="font-medium">{item.product_name}</p>
                                                        <p className="text-sm text-gray-500">Количество {item.quantity}</p>
                                                    </div>
                                                    <p className="font-semibold">{item.total} ₽</p>
                                                </div>
                                            ))}
                                            <div className="flex justify-end mt-4 pt-2 border-t border-gray-200">
                                                <p className="text-lg font-bold">Всего: {order.total_price} ₽</p>
                                            </div>
                                        </div>

                                        {/* Данные покупателя */}
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="font-medium text-gray-700 mb-2">Данные покупателя</h4>
                                            <p className="text-gray-800">
                                                {order.user?.first_name} {order.user?.last_name}
                                            </p>
                                            <p className="text-gray-600 text-sm">{order.user?.phone || '—'}</p>
                                            <p className="text-gray-600 text-sm">{order.user?.email || '—'}</p>
                                            <p className="text-gray-600 text-sm mt-2">
                                                Адрес доставки: {order.delivery_address}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrdersPage;
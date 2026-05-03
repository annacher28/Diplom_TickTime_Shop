import React, { useState, useEffect } from 'react';
import * as authApi from '../api/auth';
import * as ordersApi from '../api/orders';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const { addToast } = useToast();
    const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '', phone: '', address: '' });
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
            });
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const res = await ordersApi.getOrders();
            setOrders(res.data);
        } catch (err) {
            console.error(err);
            addToast('Ошибка загрузки заказов', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            await authApi.updateProfile(formData);
            addToast('Данные успешно обновлены', 'success');
        } catch (err) {
            console.error(err);
            addToast('Ошибка обновления данных', 'error');
        } finally {
            setUpdating(false);
        }
    };

    const getStatusText = (status) => {
        const map = { pending: 'Ожидает', paid: 'Оплачен', shipped: 'Отправлен', delivered: 'Доставлен', cancelled: 'Отменён' };
        return map[status] || status;
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-bold mb-8 text-gray-900">Личный кабинет</h1>
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Мои данные</h2>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="first_name"
                                placeholder="Имя"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-gray-500 focus:border-gray-500"
                            />
                            <input
                                type="text"
                                name="last_name"
                                placeholder="Фамилия"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-gray-500 focus:border-gray-500"
                            />
                        </div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-gray-500 focus:border-gray-500"
                        />
                        <input
                            type="text"
                            name="phone"
                            placeholder="Телефон"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-gray-500 focus:border-gray-500"
                        />
                        <textarea
                            name="address"
                            placeholder="Адрес"
                            value={formData.address}
                            onChange={handleChange}
                            rows="2"
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-gray-500 focus:border-gray-500"
                        />
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={updating}
                                className="bg-gray-800 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded-md transition disabled:opacity-50"
                            >
                                {updating ? 'Сохранение...' : 'Сохранить'}
                            </button>
                            <button
                                type="button"
                                onClick={logout}
                                className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-md transition"
                            >
                                Выйти
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Мои заказы</h2>
                    {loading ? (
                        <p className="text-gray-600">Загрузка...</p>
                    ) : orders.length === 0 ? (
                        <p className="text-gray-600">У вас пока нет заказов</p>
                    ) : (
                        <div className="space-y-4">
                            {orders.map(order => (
                                <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-center flex-wrap gap-2">
                                        <span className="font-bold text-gray-800">Заказ #{order.id}</span>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                order.status === 'delivered'
                                                    ? 'bg-green-100 text-green-800'
                                                    : order.status === 'cancelled'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                        >
                                            {getStatusText(order.status)}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-sm mt-2">Дата: {new Date(order.created_at).toLocaleDateString()}</p>
                                    <p className="font-bold text-gray-800 mt-1">Сумма: {order.total_price} ₽</p>
                                    <p className="text-sm text-gray-600 mt-1">Адрес: {order.delivery_address}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
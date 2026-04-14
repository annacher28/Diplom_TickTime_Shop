import React, { useState, useEffect } from 'react';
import * as authApi from '../api/auth';
import * as ordersApi from '../api/orders';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
    const { user, logout } = useAuth();
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
            alert('Данные обновлены');
        } catch (err) {
            console.error(err);
            alert('Ошибка обновления');
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
                <h1 className="text-3xl font-bold mb-8">Личный кабинет</h1>
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Мои данные</h2>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <input type="text" name="first_name" placeholder="Имя" value={formData.first_name} onChange={handleChange} className="border p-2 rounded" />
                            <input type="text" name="last_name" placeholder="Фамилия" value={formData.last_name} onChange={handleChange} className="border p-2 rounded" />
                        </div>
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded" />
                        <input type="text" name="phone" placeholder="Телефон" value={formData.phone} onChange={handleChange} className="w-full border p-2 rounded" />
                        <textarea name="address" placeholder="Адрес" value={formData.address} onChange={handleChange} rows="2" className="w-full border p-2 rounded" />
                        <div className="flex gap-2">
                            <button type="submit" disabled={updating} className="bg-amber-600 text-white px-4 py-2 rounded">{updating ? 'Сохранение...' : 'Сохранить'}</button>
                            <button type="button" onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded">Выйти</button>
                        </div>
                    </form>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Мои заказы</h2>
                    {loading ? <p>Загрузка...</p> : orders.length === 0 ? <p>У вас пока нет заказов</p> : (
                        <div className="space-y-4">
                            {orders.map(order => (
                                <div key={order.id} className="border rounded p-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold">Заказ #{order.id}</span>
                                        <span className={`px-2 py-1 rounded text-sm ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{getStatusText(order.status)}</span>
                                    </div>
                                    <p className="text-gray-600 text-sm">Дата: {new Date(order.created_at).toLocaleDateString()}</p>
                                    <p className="font-bold">Сумма: {order.total_price} ₽</p>
                                    <p className="text-sm">Адрес: {order.delivery_address}</p>
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
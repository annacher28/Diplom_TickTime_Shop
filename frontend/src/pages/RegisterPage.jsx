import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: '',
        phone: '',
        address: '',
    });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(formData);
            addToast('Регистрация прошла успешно!', 'success');
            navigate('/');
        } catch (err) {
            const data = err.response?.data;
            let errorMsg = 'Ошибка регистрации. Попробуйте ещё раз.';
            if (typeof data === 'object') {
                const messages = Object.values(data).flat();
                errorMsg = messages.join(' ');
            }
            addToast(errorMsg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Регистрация</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <input
                            type="text"
                            name="username"
                            placeholder="Имя пользователя*"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Пароль*"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                        />
                        <input
                            type="password"
                            name="password2"
                            placeholder="Подтверждение пароля*"
                            value={formData.password2}
                            onChange={handleChange}
                            required
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                        />
                        <input
                            type="text"
                            name="first_name"
                            placeholder="Имя"
                            value={formData.first_name}
                            onChange={handleChange}
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                        />
                        <input
                            type="text"
                            name="last_name"
                            placeholder="Фамилия"
                            value={formData.last_name}
                            onChange={handleChange}
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                        />
                        <input
                            type="text"
                            name="phone"
                            placeholder="Телефон"
                            value={formData.phone}
                            onChange={handleChange}
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                        />
                        <textarea
                            name="address"
                            placeholder="Адрес"
                            value={formData.address}
                            onChange={handleChange}
                            rows="2"
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                    >
                        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>
                    <div className="text-center">
                        <Link to="/login" className="text-sm text-gray-600 hover:text-gray-800">
                            Уже есть аккаунт? Войдите
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
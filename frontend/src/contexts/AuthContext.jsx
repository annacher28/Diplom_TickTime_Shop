import React, { createContext, useState, useContext, useEffect } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);  // флаг загрузки

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            // Если токен есть – пробуем получить профиль пользователя
            fetchUser();
        } else {
            // Токена нет – загрузка завершена, пользователь не авторизован
            setLoading(false);
        }
    }, []);

    const fetchUser = async () => {
        try {
            const response = await authApi.getProfile();
            setUser(response.data);
        } catch (error) {
            // Если запрос профиля не удался (токен просрочен или невалиден)
            console.error('Failed to fetch user:', error);
            // Очищаем токены, чтобы не пытаться снова
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        const response = await authApi.login(credentials);
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        setUser(response.data.user);
        return response.data;
    };

    const register = async (userData) => {
        const response = await authApi.register(userData);
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        setUser(response.data.user);
        return response.data;
    };

    const logout = async () => {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
            await authApi.logout(refreshToken).catch(console.error);
        }
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin' || user?.is_superuser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
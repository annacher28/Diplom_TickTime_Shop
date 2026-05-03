// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './contexts/AuthContext';
import { CartProvider, useCart } from './contexts/CartContext';
import ProtectedRoute from './components/ProtectedRoute';

// Импорт страниц
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import FavoritesPage from './pages/FavoritesPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import { ToastProvider } from './contexts/ToastContext';

// Компонент для запрета доступа админам к обычным страницам
const BlockAdminRoute = ({ children }) => {
    const { isAdmin } = useAuth();
    if (isAdmin) {
        return <Navigate to="/admin/products" replace />;
    }
    return children;
};

const Navbar = () => {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const { getCartCount } = useCart();

    return (
        <nav className="bg-gray-900 text-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Левая часть: навигационные ссылки */}
                    <div className="hidden md:flex space-x-6">
                        {isAdmin ? (
                            // Ссылки для администратора
                            <>
                                <Link to="/admin/products" className="hover:text-gray-400 transition">
                                    Управление товарами
                                </Link>
                                <Link to="/admin/orders" className="hover:text-gray-400 transition">
                                    Управление заказами
                                </Link>
                            </>
                        ) : (
                            // Ссылки для обычных пользователей и гостей
                            <>
                                <Link to="/" className="hover:text-gray-400 transition">
                                    Главная
                                </Link>
                                <Link to="/catalog" className="hover:text-gray-400 transition">
                                    Каталог
                                </Link>
                                {isAuthenticated && (
                                    <Link to="/favorites" className="hover:text-gray-400 transition">
                                        Избранное
                                    </Link>
                                )}
                                {isAuthenticated && (
                                    <Link to="/cart" className="hover:text-gray-400 transition">
                                        Корзина
                                        {getCartCount() > 0 && (
                                            <span className="ml-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
                                                {getCartCount()}
                                            </span>
                                        )}
                                    </Link>
                                )}
                            </>
                        )}
                    </div>

                    {/* Центральная часть: логотип */}
                    <div className="absolute left-1/2 transform -translate-x-1/2">
                        <Link to="/">
                           <img src="/logo_w.png" alt="TickTime Logo" className="h-10 w-auto" />
                        </Link>
                    </div>

                    {/* Правая часть: имя пользователя и выход */}
                    <div className="flex items-center space-x-4">
                        {!isAuthenticated ? (
                            <div className="space-x-2">
                                <Link to="/login" className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-800 transition">
                                    Вход
                                </Link>
                                <Link to="/register" className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-800 transition">
                                    Регистрация
                                </Link>
                            </div>
                        ) : (
                            <>
                                <Link to="/profile" className="text-sm text-gray-300 hover:text-white transition">
                                    {user?.username || user?.email || 'Аккаунт'}
                                </Link>
                                <button onClick={logout} className="px-3 py-1 rounded-md hover:text-gray-400 transition">
                                    Выйти
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

function AppContent() {
    const { loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Загрузка...</div>;
    }

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/catalog" element={<BlockAdminRoute><CatalogPage /></BlockAdminRoute>} />
                <Route path="/product/:id" element={<BlockAdminRoute><ProductDetailPage /></BlockAdminRoute>} />
                <Route path="/cart" element={<ProtectedRoute><BlockAdminRoute><CartPage /></BlockAdminRoute></ProtectedRoute>} />
                <Route path="/favorites" element={<ProtectedRoute><BlockAdminRoute><FavoritesPage /></BlockAdminRoute></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><BlockAdminRoute><ProfilePage /></BlockAdminRoute></ProtectedRoute>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/admin/products" element={<ProtectedRoute requiredRole="admin"><AdminProductsPage /></ProtectedRoute>} />
                <Route path="/admin/orders" element={<ProtectedRoute requiredRole="admin"><AdminOrdersPage /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <ToastProvider>
                        <AppContent />
                    </ToastProvider>
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
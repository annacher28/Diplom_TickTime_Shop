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
                <div className="flex items-center h-16">
                    {/* Левая группа: логотип и ссылка "Каталог" */}
                    <Link to="/" className="text-xl font-bold hover:text-gray-400 transition mr-6">
                        TickTime
                    </Link>
                    <div className="hidden md:flex space-x-6">
                        {!isAdmin && <Link to="/catalog" className="hover:text-gray-400 transition">Каталог</Link>}
                        {isAuthenticated && !isAdmin && <Link to="/favorites" className="hover:text-gray-400 transition">Избранное</Link>}
                        {isAuthenticated && !isAdmin && <Link to="/profile" className="hover:text-gray-400 transition">Личный кабинет</Link>}
                        {isAdmin && <Link to="/admin/products" className="hover:text-gray-400 transition">Управление товарами</Link>}
                        {isAdmin && <Link to="/admin/orders" className="hover:text-gray-400 transition">Управление заказами</Link>}
                    </div>

                    {/* Пружина, отодвигающая правую группу вправо */}
                    <div className="flex-1"></div>

                    {/* Правая группа: корзина, кнопки входа/выхода */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated && !isAdmin && (
                            <Link to="/cart" className="relative hover:text-gray-400 transition">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h11l-1.5-6M7 13h10M9 21h2M13 21h2" />
                                </svg>
                                {getCartCount() > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {getCartCount()}
                                    </span>
                                )}
                            </Link>
                        )}

                        {!isAuthenticated ? (
                            <div className="space-x-2">
                                <Link to="/login" className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-800 transition">Вход</Link>
                                <Link to="/register" className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-800 transition">Регистрация</Link>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <span className="text-sm text-gray-300">{user?.username}</span>
                                <button onClick={logout} className="px-3 py-1 rounded-md hover:text-gray-400 transition">Выйти</button>
                            </div>
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
                    <AppContent />
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
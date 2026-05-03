import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import * as productsApi from '../api/products';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { formatPrice } from '../utils/formatPrice';

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const intervalRef = useRef(null);
    const { isAuthenticated } = useAuth();
    const { addItem } = useCart();
    const { addToast } = useToast();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await productsApi.getProduct(id);
                setProduct(res.data);
            } catch (err) {
                console.error(err);
                addToast('Ошибка загрузки товара', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, addToast]);

    useEffect(() => {
        if (product && product.images && product.images.length > 1) {
            intervalRef.current = setInterval(() => {
                setCurrentImageIndex(prev => (prev + 1) % product.images.length);
            }, 4000);
        }
        return () => clearInterval(intervalRef.current);
    }, [product]);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        try {
            await addItem(product.id, quantity);
            addToast('Товар добавлен в корзину', 'success');
        } catch (err) {
            console.error(err);
            addToast('Ошибка добавления в корзину', 'error');
        }
    };

    const handleMouseEnter = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    const handleMouseLeave = () => {
        if (product && product.images && product.images.length > 1) {
            intervalRef.current = setInterval(() => {
                setCurrentImageIndex(prev => (prev + 1) % product.images.length);
            }, 4000);
        }
    };

    if (loading) return <div className="text-center py-16">Загрузка...</div>;
    if (!product) return <div className="text-center py-16">Товар не найден</div>;

    let images = product.images || [];
    if (images.length === 0 && product.image) {
        images = [{ image: product.image }];
    }
    const mainImage = images.length > 0
        ? (images[currentImageIndex].image.startsWith('http')
            ? images[currentImageIndex].image
            : `http://127.0.0.1:8000${images[currentImageIndex].image}`)
        : null;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="flex gap-2 text-sm text-gray-500 mb-6">
                    <Link to="/" className="hover:text-gray-700">Главная</Link>
                    <span>/</span>
                    <Link to="/catalog" className="hover:text-gray-700">Каталог</Link>
                    <span>/</span>
                    <span className="text-gray-800">{product.name}</span>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-8 p-6">
                        <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                            {mainImage ? (
                                <img src={mainImage} alt={product.name} className="w-full h-96 object-contain rounded-lg" />
                            ) : (
                                <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg">Нет фото</div>
                            )}
                            {images.length > 1 && (
                                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                                    {images.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`w-2 h-2 rounded-full transition ${
                                                idx === currentImageIndex ? 'bg-gray-800 w-4' : 'bg-gray-400'
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                            <p className="text-gray-600 text-sm mb-4">Артикул: {product.article || '—'}</p>
                            <div className="text-3xl font-bold text-gray-800 mb-4">{formatPrice(product.price)} ₽</div>
                            <div className="mb-4">На складе: {product.stock} шт.</div>
                            <div className="flex items-center gap-4 mb-6">
                                <label className="font-medium">Количество:</label>
                                <input
                                    type="number"
                                    min="1"
                                    max={product.stock}
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                                    className="w-20 px-3 py-2 border border-gray-300 rounded-md text-center"
                                />
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className="w-full md:w-auto bg-gray-800 hover:bg-gray-700 text-white font-semibold px-8 py-3 rounded-lg transition"
                            >
                                Добавить в корзину
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md mt-6 overflow-hidden">
                    <div className="border-b border-gray-200 flex flex-wrap">
                        <button
                            className={`px-6 py-3 font-medium text-sm ${
                                activeTab === 'description'
                                    ? 'border-b-2 border-gray-800 text-gray-800'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setActiveTab('description')}
                        >
                            Описание
                        </button>
                        <button
                            className={`px-6 py-3 font-medium text-sm ${
                                activeTab === 'specs'
                                    ? 'border-b-2 border-gray-800 text-gray-800'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setActiveTab('specs')}
                        >
                            Характеристики
                        </button>
                        <button
                            className={`px-6 py-3 font-medium text-sm ${
                                activeTab === 'delivery'
                                    ? 'border-b-2 border-gray-800 text-gray-800'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setActiveTab('delivery')}
                        >
                            Заказ и оплата
                        </button>
                    </div>
                    <div className="p-6">
                        {activeTab === 'description' && (
                            <div className="prose max-w-none"><p>{product.description}</p></div>
                        )}
                        {activeTab === 'specs' && (
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><span className="font-medium">Артикул:</span> {product.article || '—'}</div>
                                <div><span className="font-medium">Страна:</span> {product.country || '—'}</div>
                                <div><span className="font-medium">Тип исполнения:</span> {product.type_execution || '—'}</div>
                                <div><span className="font-medium">Коллекция:</span> {product.collection || '—'}</div>
                                <div><span className="font-medium">Корпус:</span> {product.case_material || '—'}</div>
                                <div><span className="font-medium">Циферблат:</span> {product.dial || '—'}</div>
                            </div>
                        )}
                        {activeTab === 'delivery' && (
                            <div className="space-y-2 text-gray-700">
                                <p><strong>Способы доставки:</strong> Курьерская служба, Почта России.</p>
                                <p><strong>Оплата:</strong> Наличными при получении, картой онлайн.</p>
                                <p><strong>Гарантия:</strong> 2 года.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
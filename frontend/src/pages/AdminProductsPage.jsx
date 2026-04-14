import React, { useState, useEffect } from 'react';
import * as productsApi from '../api/products';

const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        image: null,
    });
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await productsApi.getProducts();
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image' && files && files[0]) {
            setForm({ ...form, image: files[0] });
            setPreview(URL.createObjectURL(files[0]));
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await productsApi.updateProduct(editing.id, form);
            } else {
                await productsApi.createProduct(form);
            }
            setEditing(null);
            setForm({ name: '', description: '', price: '', stock: '', image: null });
            setPreview(null);
            fetchProducts();
        } catch (err) {
            console.error(err);
            alert('Ошибка сохранения');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Удалить товар?')) {
            try {
                await productsApi.deleteProduct(id);
                fetchProducts();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const startEdit = (product) => {
        setEditing(product);
        setForm({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            image: null,
        });
        // Предпросмотр существующего фото
        if (product.image) {
            setPreview(`${product.image}`);
        } else {
            setPreview(null);
        }
    };

    if (loading) return <div className="text-center py-16">Загрузка...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">Управление товарами</h1>

                {/* Форма добавления/редактирования */}
                <div className="bg-white p-6 rounded shadow mb-8">
                    <h2 className="text-xl font-semibold mb-4">
                        {editing ? 'Редактировать товар' : 'Добавить товар'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="name"
                            placeholder="Название"
                            value={form.name}
                            onChange={handleInputChange}
                            className="w-full border p-2 rounded"
                            required
                        />
                        <textarea
                            name="description"
                            placeholder="Описание"
                            value={form.description}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full border p-2 rounded"
                            required
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="number"
                                name="price"
                                placeholder="Цена"
                                value={form.price}
                                onChange={handleInputChange}
                                className="border p-2 rounded"
                                required
                            />
                            <input
                                type="number"
                                name="stock"
                                placeholder="Остаток"
                                value={form.stock}
                                onChange={handleInputChange}
                                className="border p-2 rounded"
                                required
                            />
                        </div>
                        {/* Поле для загрузки изображения */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Изображение
                            </label>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleInputChange}
                                className="w-full border p-2 rounded"
                            />
                            {preview && (
                                <div className="mt-2">
                                    <img
                                        src={preview}
                                        alt="Предпросмотр"
                                        className="h-24 w-24 object-cover rounded"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded transition"
                            >
                                Сохранить
                            </button>
                            {editing && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditing(null);
                                        setForm({
                                            name: '',
                                            description: '',
                                            price: '',
                                            stock: '',
                                            image: null,
                                        });
                                        setPreview(null);
                                    }}
                                    className="bg-gray-500 hover:bg-gray-900 text-white px-4 py-2 rounded transition"
                                >
                                    Отмена
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Таблица товаров */}
                <div className="bg-white rounded shadow overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Название
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Цена
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Остаток
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {/* Без заголовка */}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((p) => (
                                <tr key={p.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                        {p.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                        {p.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                        {p.price} ₽
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                        {p.stock}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                        <button
                                            onClick={() => startEdit(p)}
                                            className="bg-gray-800 hover:bg-gray-900 text-white px-3 py-1 rounded mr-2 transition"
                                        >
                                            Изменить
                                        </button>
                                        <button
                                            onClick={() => handleDelete(p.id)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                                        >
                                            Удалить
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminProductsPage;
import React, { createContext, useState, useContext, useEffect } from 'react';
import * as cartApi from '../api/cart';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    const fetchCart = async () => {
        if (!isAuthenticated) {
            setCartItems([]);
            return;
        }
        setLoading(true);
        try {
            const response = await cartApi.getCart();
            setCartItems(response.data);
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [isAuthenticated]);

    const addItem = async (productId, quantity = 1) => {
        if (!isAuthenticated) return;
        try {
            await cartApi.addToCart(productId, quantity);
            await fetchCart();
        } catch (error) {
            console.error('Failed to add item:', error);
        }
    };

    const updateItem = async (itemId, quantity) => {
        if (!isAuthenticated) return;
        try {
            await cartApi.updateCartItem(itemId, quantity);
            await fetchCart();
        } catch (error) {
            console.error('Failed to update item:', error);
        }
    };

    const removeItem = async (itemId) => {
        if (!isAuthenticated) return;
        try {
            await cartApi.removeFromCart(itemId);
            await fetchCart();
        } catch (error) {
            console.error('Failed to remove item:', error);
        }
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + parseFloat(item.total), 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const value = {
        cartItems,
        loading,
        addItem,
        updateItem,
        removeItem,
        getCartTotal,
        getCartCount,
        refreshCart: fetchCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
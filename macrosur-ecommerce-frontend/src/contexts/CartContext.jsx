import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    // Estado mínimo necesario para que HomePage no falle al leer cartCount
    const [cartItems, setCartItems] = useState([]);

    const cartCount = cartItems.length;

    const contextValue = {
        cartItems,
        cartCount,
        // Funciones stub para simular acciones
        addToCart: (product) => console.log('Simulación: Producto añadido:', product),
        removeFromCart: (id) => console.log('Simulación: Producto removido:', id),
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};
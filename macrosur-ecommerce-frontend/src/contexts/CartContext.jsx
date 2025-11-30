import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        // Cargar carrito desde localStorage al iniciar
        const savedCart = localStorage.getItem('macrosur_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Guardar en localStorage cada vez que cambia el carrito
    useEffect(() => {
        localStorage.setItem('macrosur_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const cartCount = cartItems.reduce((total, item) => total + item.cantidad, 0);

    const cartTotal = cartItems.reduce((total, item) => {
        return total + (item.precio * item.cantidad);
    }, 0);

    /**
     * Agregar producto al carrito
     * @param {Object} product - Producto con varianteId, nombre, precio, imagen, sku, stock
     * @param {Number} cantidad - Cantidad a agregar (default: 1)
     */
    const addToCart = (product, cantidad = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.varianteId === product.varianteId);
            
            if (existingItem) {
                // Si ya existe, aumentar cantidad (validar stock)
                const nuevaCantidad = existingItem.cantidad + cantidad;
                if (nuevaCantidad > product.stock) {
                    alert(`Stock insuficiente. Disponible: ${product.stock}`);
                    return prevItems;
                }
                
                return prevItems.map(item =>
                    item.varianteId === product.varianteId
                        ? { ...item, cantidad: nuevaCantidad }
                        : item
                );
            } else {
                // Agregar nuevo item
                if (cantidad > product.stock) {
                    alert(`Stock insuficiente. Disponible: ${product.stock}`);
                    return prevItems;
                }
                
                return [...prevItems, {
                    varianteId: product.varianteId,
                    productoId: product.productoId,
                    nombre: product.nombre,
                    nombreVariante: product.nombreVariante || 'Estándar',
                    sku: product.sku,
                    precio: product.precio,
                    imagen: product.imagen,
                    cantidad: cantidad,
                    stock: product.stock
                }];
            }
        });
    };

    /**
     * Remover producto del carrito
     */
    const removeFromCart = (varianteId) => {
        setCartItems(prevItems => prevItems.filter(item => item.varianteId !== varianteId));
    };

    /**
     * Actualizar cantidad de un item
     */
    const updateQuantity = (varianteId, nuevaCantidad) => {
        if (nuevaCantidad < 1) {
            removeFromCart(varianteId);
            return;
        }

        setCartItems(prevItems =>
            prevItems.map(item => {
                if (item.varianteId === varianteId) {
                    if (nuevaCantidad > item.stock) {
                        alert(`Stock insuficiente. Disponible: ${item.stock}`);
                        return item;
                    }
                    return { ...item, cantidad: nuevaCantidad };
                }
                return item;
            })
        );
    };

    /**
     * Vaciar carrito completamente
     */
    const clearCart = () => {
        setCartItems([]);
    };

    /**
     * Obtener item del carrito por varianteId
     */
    const getItemQuantity = (varianteId) => {
        const item = cartItems.find(item => item.varianteId === varianteId);
        return item ? item.cantidad : 0;
    };

    const contextValue = {
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};
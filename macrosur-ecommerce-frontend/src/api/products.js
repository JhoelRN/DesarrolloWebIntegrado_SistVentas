import axios from 'axios';

const API_URL = 'http://localhost:8081/api/productos';

// Obtener header de autenticación (si existe)
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Obtener productos destacados (limitados, para la página principal)
 */
export const getFeaturedProducts = async (limit = 8) => {
    try {
        const response = await axios.get(`${API_URL}`, {
            params: {
                page: 0,
                size: limit
            },
            headers: { ...getAuthHeader() }
        });
        
        // Transformar datos del backend al formato esperado por el frontend
        const productos = response.data.productos || response.data.content || [];
        return productos.map(producto => ({
            id: producto.productoId,
            name: producto.nombreProducto,
            price: producto.precioUnitario,
            image: producto.imagenUrl || 'https://via.placeholder.com/400x300/e9ecef/212529?text=Sin+Imagen',
            sku: producto.codigoProducto,
            description: producto.descripcionCorta,
            fichaTecnica: producto.fichaTecnicaHtml,
            activo: producto.activo
        }));
    } catch (error) {
        console.error('Error al cargar productos destacados:', error);
        return [];
    }
};

/**
 * Obtener catálogo completo con filtros y paginación
 */
export const getProducts = async (filters = {}) => {
    try {
        const {
            page = 0,
            size = 20,
            search = '',
            categoriaId = null,
            precioMin = null,
            precioMax = null,
            activo = true
        } = filters;

        const params = {
            page,
            size
        };

        if (search) params.search = search;
        if (categoriaId) params.categoria = categoriaId;
        if (precioMin !== null) params.precioMin = precioMin;
        if (precioMax !== null) params.precioMax = precioMax;

        const response = await axios.get(`${API_URL}`, {
            params,
            headers: { ...getAuthHeader() }
        });

        const productos = response.data.productos || response.data.content || [];
        return {
            content: productos.map(producto => ({
                id: producto.productoId,
                name: producto.nombreProducto,
                price: producto.precioUnitario,
                image: producto.imagenUrl || 'https://via.placeholder.com/400x300/e9ecef/212529?text=Sin+Imagen',
                sku: producto.codigoProducto,
                description: producto.descripcionCorta,
                fichaTecnica: producto.fichaTecnicaHtml,
                activo: producto.activo,
                categorias: producto.categorias || []
            })),
            totalPages: response.data.totalPages,
            totalElements: response.data.totalElements || response.data.totalItems,
            currentPage: response.data.currentPage !== undefined ? response.data.currentPage : response.data.number
        };
    } catch (error) {
        console.error('Error al cargar productos:', error);
        return {
            content: [],
            totalPages: 0,
            totalElements: 0,
            currentPage: 0
        };
    }
};

/**
 * Obtener detalle de un producto por ID
 */
export const getProductById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`, {
            headers: { ...getAuthHeader() }
        });

        const producto = response.data;
        return {
            id: producto.productoId,
            name: producto.nombreProducto,
            price: producto.precioUnitario,
            image: producto.imagenUrl || 'https://via.placeholder.com/400x300/e9ecef/212529?text=Sin+Imagen',
            sku: producto.codigoProducto,
            description: producto.descripcionCorta,
            fichaTecnica: producto.fichaTecnicaHtml,
            peso: producto.pesoKg,
            volumen: producto.volumenM3,
            activo: producto.activo,
            categorias: producto.categorias || []
        };
    } catch (error) {
        console.error('Error al cargar detalle del producto:', error);
        throw error;
    }
};
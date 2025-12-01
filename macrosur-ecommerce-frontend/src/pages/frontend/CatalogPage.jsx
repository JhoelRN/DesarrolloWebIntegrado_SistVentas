import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Pagination, InputGroup } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard';
import * as productsApi from '../../api/products';
import * as categoriasApi from '../../api/categorias';

const CatalogPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    
    // Filtros
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [precioMin, setPrecioMin] = useState('');
    const [precioMax, setPrecioMax] = useState('');

    // Cargar categorías al montar el componente
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoriasApi.getCategorias({ activo: true });
                setCategories(data.content || []);
            } catch (error) {
                console.error('Error al cargar categorías:', error);
            }
        };
        fetchCategories();
    }, []);

    // Leer parámetros de la URL al montar
    useEffect(() => {
        const searchFromUrl = searchParams.get('search') || '';
        const categoriaFromUrl = searchParams.get('categoria') || '';
        
        if (searchFromUrl) setSearchTerm(searchFromUrl);
        if (categoriaFromUrl) setSelectedCategory(categoriaFromUrl);
    }, [searchParams]);

    // Cargar productos cuando cambien los filtros
    useEffect(() => {
        loadProducts();
    }, [currentPage, searchTerm, selectedCategory, precioMin, precioMax]);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const filters = {
                page: currentPage,
                size: 20,
                search: searchTerm,
                categoriaId: selectedCategory || null,
                precioMin: precioMin ? parseFloat(precioMin) : null,
                precioMax: precioMax ? parseFloat(precioMax) : null,
                activo: true
            };

            const response = await productsApi.getProducts(filters);
            setProducts(response.content);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(0); // Reset a la primera página
        loadProducts();
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setPrecioMin('');
        setPrecioMax('');
        setCurrentPage(0);
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const items = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(0, endPage - maxPagesToShow + 1);
        }

        // Primera página
        if (startPage > 0) {
            items.push(
                <Pagination.First key="first" onClick={() => setCurrentPage(0)} />
            );
        }

        // Página anterior
        if (currentPage > 0) {
            items.push(
                <Pagination.Prev key="prev" onClick={() => setCurrentPage(currentPage - 1)} />
            );
        }

        // Páginas numeradas
        for (let page = startPage; page <= endPage; page++) {
            items.push(
                <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                >
                    {page + 1}
                </Pagination.Item>
            );
        }

        // Página siguiente
        if (currentPage < totalPages - 1) {
            items.push(
                <Pagination.Next key="next" onClick={() => setCurrentPage(currentPage + 1)} />
            );
        }

        // Última página
        if (endPage < totalPages - 1) {
            items.push(
                <Pagination.Last key="last" onClick={() => setCurrentPage(totalPages - 1)} />
            );
        }

        return <Pagination className="justify-content-center mt-4">{items}</Pagination>;
    };

    return (
        <Container className="my-5">
            <h1 className="mb-4 fw-bold">Catálogo de Productos</h1>

            <Row>
                {/* Panel de Filtros */}
                <Col md={3} className="mb-4">
                    <div className="bg-light p-3 rounded shadow-sm sticky-top" style={{ top: '20px' }}>
                        <h5 className="mb-3 fw-semibold">Filtros</h5>

                        {/* Búsqueda */}
                        <Form onSubmit={handleSearch} className="mb-3">
                            <Form.Group>
                                <Form.Label>Buscar</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nombre o código..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <Button variant="primary" type="submit">
                                        <i className="bi bi-search"></i>
                                    </Button>
                                </InputGroup>
                            </Form.Group>
                        </Form>

                        {/* Categoría */}
                        <Form.Group className="mb-3">
                            <Form.Label>Categoría</Form.Label>
                            <Form.Select
                                value={selectedCategory}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                    setCurrentPage(0);
                                }}
                            >
                                <option value="">Todas las categorías</option>
                                {categories.map((cat) => (
                                    <option key={cat.categoriaId} value={cat.categoriaId}>
                                        {cat.nombre}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        {/* Rango de Precio */}
                        <Form.Group className="mb-3">
                            <Form.Label>Precio Mínimo</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                placeholder="$0.00"
                                value={precioMin}
                                onChange={(e) => {
                                    setPrecioMin(e.target.value);
                                    setCurrentPage(0);
                                }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Precio Máximo</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                placeholder="$999.99"
                                value={precioMax}
                                onChange={(e) => {
                                    setPrecioMax(e.target.value);
                                    setCurrentPage(0);
                                }}
                            />
                        </Form.Group>

                        <Button
                            variant="outline-secondary"
                            className="w-100"
                            onClick={handleClearFilters}
                        >
                            <i className="bi bi-x-circle me-2"></i>
                            Limpiar Filtros
                        </Button>
                    </div>
                </Col>

                {/* Listado de Productos */}
                <Col md={9}>
                    {/* Información de resultados */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <p className="text-muted mb-0">
                            {loading ? (
                                'Cargando...'
                            ) : (
                                `Mostrando ${products.length} de ${totalElements} productos`
                            )}
                        </p>
                    </div>

                    {/* Grid de Productos */}
                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-3 text-muted">Cargando productos...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="bi bi-inbox fs-1 text-muted"></i>
                            <p className="mt-3 text-muted">
                                No se encontraron productos con los filtros seleccionados.
                            </p>
                            <Button variant="primary" onClick={handleClearFilters}>
                                Ver todos los productos
                            </Button>
                        </div>
                    ) : (
                        <>
                            <Row>
                                {products.map((product) => (
                                    <Col key={product.id} sm={6} lg={4} xl={3} className="mb-4">
                                        <ProductCard product={product} />
                                    </Col>
                                ))}
                            </Row>

                            {/* Paginación */}
                            {renderPagination()}
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default CatalogPage;

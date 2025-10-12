import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard';
import * as productsApi from '../../api/products';

const CatalogoPage = () => {
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sort, setSort] = useState('');
  const [brandFilters, setBrandFilters] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 12;

  // Leer parámetros de la URL
  const { query, category, tag } = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return {
      query: params.get('q') || '',
      category: params.get('c') || '',
      tag: params.get('tag') || '',
    };
  }, [location.search]);

  // Título dinámico
  const pageTitle = useMemo(() => {
    const map = {
      alfombras: 'Catálogo de Alfombras',
      cortinas: 'Catálogo de Cortinas',
      accesorios: 'Catálogo de Accesorios',
    };
    return map[category] || 'Catálogo de Productos';
  }, [category]);

  // Cargar productos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productsApi.getProducts({ query, category, tag });

        // --- MOCK ACTUAL (array plano con category) ---
        if (Array.isArray(data)) {
          setProducts(data);
          setTotalPages(1); // con mocks no hay paginación real
          setAvailableBrands(
            category === 'accesorios'
              ? []
              : Array.from(new Set(data.map(p => p.brand).filter(Boolean)))
          );
        }

        // --- IMPLEMENTACIÓN REAL (cuando backend esté listo) ---
        else if (data && data.items) {
          setProducts(data.items);
          setTotalPages(data.totalPages || 1);
          setAvailableBrands(data.brands || []);
        }

        setBrandFilters([]);
        setPage(1);
      } catch (error) {
        console.error('Error cargando productos:', error);
        setProducts([]);
        setAvailableBrands([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [query, category, tag]);

  // Filtros y orden
  const filteredAndSorted = useMemo(() => {
    let list = [...products];
    if (availableBrands.length > 0 && brandFilters.length > 0) {
      list = list.filter(p => brandFilters.includes(p.brand));
    }
    if (sort === 'price-asc') list.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sort === 'price-desc') list.sort((a, b) => (b.price || 0) - (a.price || 0));
    return list;
  }, [products, brandFilters, availableBrands, sort]);

  // Paginación local (para mocks)
  const pagedProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredAndSorted.slice(start, start + PAGE_SIZE);
  }, [filteredAndSorted, page]);

  const handleSortChange = (e) => setSort(e.target.value);
  const toggleBrand = (brand) => {
    setBrandFilters(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
    setPage(1);
  };

  return (
    <Container className="my-5">
      <h1 className="fw-bold mb-4">{pageTitle}</h1>
      <Row>
        {/* Panel de filtros */}
        <Col md={3}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h5 className="fw-bold mb-4">Filtros</h5>

              {/* Orden */}
              <div className="mb-4">
                <Form.Label className="small text-muted">Ordenar por</Form.Label>
                <Form.Select value={sort} onChange={handleSortChange}>
                  <option value="">Seleccione</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                </Form.Select>
              </div>

              {/* Marcas */}
              {availableBrands.length > 0 && (
                <div className="mb-4">
                  <Form.Label className="small text-muted">Marcas</Form.Label>
                  <div className="border rounded p-2">
                    {availableBrands.map((brand) => (
                      <Form.Check
                        key={brand}
                        type="checkbox"
                        label={brand}
                        checked={brandFilters.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="mb-2"
                      />
                    ))}
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Catálogo */}
        <Col md={9}>
          <Row className="g-4">
            {loading && (
              <div className="text-center text-muted py-5 w-100">
                <i className="bi bi-arrow-repeat fs-2"></i>
                <p>Cargando productos...</p>
              </div>
            )}
            {!loading && pagedProducts.map(product => (
              <Col key={product.id} lg={3}>
                <ProductCard product={product} />
              </Col>
            ))}
            {!loading && pagedProducts.length === 0 && (
              <div className="text-center text-muted py-5 w-100">
                <i className="bi bi-box-seam fs-2"></i>
                <p>No se encontraron productos.</p>
              </div>
            )}
          </Row>

          {/* Paginación */}
          {!loading && totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  variant={i + 1 === page ? 'primary' : 'outline-primary'}
                  className="mx-1"
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CatalogoPage;
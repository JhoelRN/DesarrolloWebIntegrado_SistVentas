import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Form, Button, InputGroup, Dropdown } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import * as categoriasApi from '../../api/categorias';

const Header = () => {
    const { isAuthenticated, user, userRole, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [categorias, setCategorias] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Cargar categorías al montar el componente
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const data = await categoriasApi.getCategorias({ activo: true, size: 10 });
                // Filtrar solo categorías principales (sin padre) y visibles al cliente
                const principales = (data.content || []).filter(
                    cat => !cat.categoriaPadreId && cat.visibleCliente
                );
                setCategorias(principales.slice(0, 5)); // Máximo 5 para el navbar
            } catch (error) {
                console.error('Error al cargar categorías:', error);
            }
        };
        fetchCategorias();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/catalogo?search=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm(''); // Limpiar después de buscar
        }
    };

    return (
        <header className="fixed-top shadow-sm">
            {/* Top Bar de Servicios y Ayuda */}
            <div className="bg-light border-bottom py-1 small">
                <Container className="d-flex justify-content-end">
                    <Nav>
                        <Nav.Link as={Link} to="/info/soporte" className="text-secondary me-3">
                            <i className="bi bi-headset me-1"></i> Ayuda al Cliente
                        </Nav.Link>
                        <Nav.Link as={Link} to="/track" className="text-secondary">
                            <i className="bi bi-geo-alt-fill me-1"></i> Rastrea tu Pedido
                        </Nav.Link>
                    </Nav>
                </Container>
            </div>

            {/* Navbar Principal */}
            <Navbar bg="white" expand="lg" className="py-3">
                <Container>
                    <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 text-primary">
                        MACROSUR
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        
                        {/* 1. Barra de Búsqueda Centrada */}
                        <Form className="d-flex mx-auto" onSubmit={handleSearch} style={{ maxWidth: '500px' }}>
                            <InputGroup>
                                <Form.Control
                                    type="search"
                                    placeholder="Buscar productos..."
                                    className="me-2 rounded-start"
                                    aria-label="Search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Button variant="primary" type="submit" className="rounded-end" disabled={!searchTerm.trim()}>
                                    <i className="bi bi-search"></i>
                                </Button>
                            </InputGroup>
                        </Form>

                        {/* 2. Iconos de Usuario y Carrito */}
                        <Nav className="ms-auto d-flex align-items-center">
                            {/* Menú de Usuario (AuthContext unificado para Admin y Cliente) */}
                            {isAuthenticated ? (
                                <Dropdown align="end" className="me-2">
                                    <Dropdown.Toggle 
                                        variant={userRole === 'CLIENTE' ? 'success' : 'light'} 
                                        id="dropdown-basic" 
                                        className="rounded-pill px-3"
                                    >
                                        <i className="bi bi-person-circle me-1"></i> 
                                        {user?.name || 'Mi Cuenta'}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {userRole === 'CLIENTE' && (
                                            <>
                                                <Dropdown.Item as={Link} to="/cliente/perfil">
                                                    <i className="bi bi-person me-2"></i>Mi Perfil
                                                </Dropdown.Item>
                                                <Dropdown.Item as={Link} to="/mis-pedidos">
                                                    <i className="bi bi-box-seam me-2"></i>Mis Pedidos
                                                </Dropdown.Item>
                                                <Dropdown.Divider />
                                            </>
                                        )}
                                        {(userRole === 'ADMIN' || userRole === 'GESTOR_LOGISTICA' || userRole === 'GESTOR_PRODUCTOS' || userRole === 'GESTOR_COMERCIAL') && (
                                            <>
                                                <Dropdown.Item as={Link} to="/admin/dashboard" className="text-danger">
                                                    <i className="bi bi-speedometer2 me-2"></i>Panel Admin
                                                </Dropdown.Item>
                                                <Dropdown.Divider />
                                            </>
                                        )}
                                        <Dropdown.Item onClick={() => { logout(); navigate('/'); }}>
                                            <i className="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            ) : (
                                <>
                                    <Nav.Link as={Link} to="/login" className="btn btn-outline-primary me-2 rounded-pill px-3">
                                        <i className="bi bi-person me-1"></i>Iniciar Sesión
                                    </Nav.Link>
                                    
                                    {/* Enlace al login de Admin */}
                                    <Nav.Link as={Link} to="/admin/login" className="btn btn-outline-danger me-2 rounded-pill px-3 d-none d-lg-inline">
                                        <i className="bi bi-shield-lock me-1"></i>Admin
                                    </Nav.Link>
                                </>
                            )}
                            
                            {/* Icono de Carrito */}
                            <Nav.Link as={Link} to="/cart" className="position-relative">
                                <i className="bi bi-cart3 fs-4"></i>
                                {cartCount > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {cartCount}
                                    </span>
                                )}
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Navbar de Categorías Dinámicas */}
            <Navbar bg="dark" variant="dark" className="py-2 d-none d-lg-block">
                <Container>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/catalogo" className="fw-semibold text-white">
                            <i className="bi bi-grid-3x3-gap me-1"></i> Todas las Categorías
                        </Nav.Link>
                        {categorias.map((categoria) => (
                            <Nav.Link 
                                key={categoria.categoriaId}
                                as={Link} 
                                to={`/catalogo?categoria=${categoria.categoriaId}`}
                                className="text-white-50"
                            >
                                {categoria.nombre}
                            </Nav.Link>
                        ))}
                    </Nav>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;
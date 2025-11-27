import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Form, Button, InputGroup, Dropdown, Badge } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import * as categoriasApi from '../../api/categorias';

const Header = () => {
    const { isAuthenticated, user, userRole, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    
    const [categorias, setCategorias] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [expanded, setExpanded] = useState(false);

    // Cargar categorías
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const data = await categoriasApi.getCategorias({ activo: true, size: 20 });
                const principales = (data.content || []).filter(c => !c.categoriaPadreId && c.visibleCliente);
                setCategorias(principales);
            } catch (error) {
                console.warn('Modo offline: usando categorías locales.');
               setCategorias([
                    { categoriaId: 1, nombre: 'Cortinas y Persianas' },
                    { categoriaId: 2, nombre: 'Alfombras y Tapetes' },
                    { categoriaId: 3, nombre: 'Ropa de Cama' },
                    { categoriaId: 4, nombre: 'Cojines y Fundas' },
                    { categoriaId: 5, nombre: 'Decoración de Pared' }
                ]);
            }
        };
        fetchCategorias();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/catalogo?search=${encodeURIComponent(searchTerm.trim())}`);
            setExpanded(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        setExpanded(false);
    };

    const handleAccountClick = () => {
        if (isAuthenticated) {
            navigate('/cliente/perfil');
        } else {
            navigate('/login');
        }
    };

    return (
        <header className="fixed-top bg-white shadow-sm" style={{ zIndex: 1030 }}>
            {/* --- NIVEL 1: BARRA SUPERIOR --- */}

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

            {/* --- NIVEL 2: HEADER PRINCIPAL --- */}
            <Navbar bg="white" expand="lg" className="py-3" expanded={expanded}>
                <Container>
                    {/* Logo */}
                    <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 text-primary me-lg-4 d-flex align-items-center" onClick={() => setExpanded(false)}>
                        <div className="bg-primary text-white rounded px-2 me-1 pb-1" style={{ fontSize: '1.8rem', lineHeight: '1' }}>M</div>
                        ACROSUR
                    </Navbar.Brand>

                    <Navbar.Toggle 
                        aria-controls="navbar-mobile-content" 
                        onClick={() => setExpanded(expanded ? false : true)}
                        className="border-0"
                    />

                    {/* BUSCADOR CORREGIDO (Estilo Unificado) */}
                    <Form className="d-none d-lg-flex flex-grow-1 mx-lg-5" onSubmit={handleSearch}>
                        <InputGroup>
                            <Form.Control
                                type="search"
                                placeholder="¿Qué estás buscando hoy?"
                                className="border-secondary border-opacity-25 py-2 border-end-0 shadow-none"
                                style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }} 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button 
                                variant="outline-secondary" 
                                type="submit" 
                                className="border-secondary border-opacity-25 bg-white text-secondary px-4 border-start-0 shadow-none"
                                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                            >
                                <i className="bi bi-search"></i>
                            </Button>
                        </InputGroup>
                    </Form>

                    {/* Iconos Derecha */}
                    <div className="d-none d-lg-flex align-items-center gap-4 ms-auto">
                        
                        {/* Zona Usuario */}
                        {isAuthenticated ? (
                            <Dropdown align="end">
                                <Dropdown.Toggle variant="white" className="d-flex align-items-center border-0 p-0 text-dark bg-transparent remove-caret">
                                    <i className="bi bi-person-circle fs-2 text-dark me-2"></i>
                                    <div className="text-start lh-1">
                                        <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Hola,</small>
                                        <span className="fw-bold text-truncate" style={{ maxWidth: '100px', display: 'inline-block' }}>
                                            {user?.name?.split(' ')[0]}
                                        </span>
                                    </div>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="shadow border-0 mt-3">
                                    <Dropdown.Header>Mi Cuenta</Dropdown.Header>
                                    <Dropdown.Item as={Link} to="/cliente/perfil"><i className="bi bi-person-gear me-2"></i> Perfil</Dropdown.Item>
                                    <Dropdown.Item as={Link} to="/cliente/perfil/orders"><i className="bi bi-box-seam me-2"></i> Mis Pedidos</Dropdown.Item>
                                    {(userRole === 'ADMIN' || userRole === 'GESTOR') && (
                                        <>
                                            <Dropdown.Divider />
                                            <Dropdown.Item as={Link} to="/admin/dashboard" className="text-primary fw-bold">Panel Admin</Dropdown.Item>
                                        </>
                                    )}
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={handleLogout} className="text-danger">Cerrar Sesión</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                            <Link to="/login" className="d-flex align-items-center text-decoration-none text-dark" onClick={handleAccountClick}>
                                <i className="bi bi-person fs-2 me-2"></i>
                                <div className="lh-1">
                                    <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Bienvenido</small>
                                    <span className="fw-bold small">Ingresa / Regístrate</span>
                                </div>
                            </Link>
                        )}

                        {/* Carrito */}
                        <Link to="/carrito" className="position-relative text-dark d-flex align-items-center text-decoration-none">
                            <i className="bi bi-cart3 fs-2"></i>
                            {cartCount > 0 && (
                                <Badge 
                                    bg="danger" 
                                    pill 
                                    className="position-absolute top-0 start-100 translate-middle border border-2 border-white"
                                    style={{ fontSize: '0.7rem', padding: '0.35em 0.5em' }}
                                >
                                    {cartCount}
                                </Badge>
                            )}
                        </Link>
                    </div>
                </Container>
            </Navbar>

            {/* --- NIVEL 3: BARRA AZUL --- */}
            <div className="bg-primary d-none d-lg-block">
                <Container>
                    <Nav className="align-items-center">
                        <Dropdown>
                            <Dropdown.Toggle 
                                variant="primary" 
                                className="rounded-0 fw-bold px-3 border-end border-white border-opacity-25 py-2 d-flex align-items-center"
                                style={{ boxShadow: 'none' }}
                            >
                                <i className="bi bi-list fs-5 me-2"></i> Categorías
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="shadow border-0 rounded-0 mt-0 w-100" style={{ minWidth: '220px' }}>
                                {categorias.map((cat) => (
                                    <Dropdown.Item 
                                        key={cat.categoriaId} 
                                        as={Link} 
                                        to={`/catalogo?categoria=${cat.categoriaId}`}
                                        className="py-2 border-bottom"
                                    >
                                        {cat.nombre}
                                    </Dropdown.Item>
                                ))}
                                <Dropdown.Item as={Link} to="/catalogo" className="py-2 text-primary fw-bold text-center bg-light">
                                    Ver Todo el Catálogo
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        <Nav.Link as={Link} to="/" className="text-white px-4 hover-light py-2">Inicio</Nav.Link>
                        <Nav.Link as={Link} to="/catalogo" className="text-white px-4 hover-light py-2">Catálogo</Nav.Link>
                        <Nav.Link as={Link} to="info/nosotros" className="text-white px-4 hover-light py-2">Nosotros</Nav.Link>
                        <Nav.Link as={Link} to="/info/contacto" className="text-white px-4 hover-light py-2">Contacto</Nav.Link>
                    </Nav>
                </Container>
            </div>
        </header>
    );
};

export default Header;
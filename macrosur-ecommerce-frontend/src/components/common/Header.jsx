import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Navbar,
  Nav,
  Container,
  Form,
  Button,
  InputGroup,
  Dropdown,
  Badge,
} from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Header = () => {
  const { isAuthenticated, user, userRole, logout } = useAuth();
  const { cartItems, cartCount } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.searchQuery.value;
    if (query) {
      navigate(`/catalogo?q=${query}`);
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <header className="fixed-top shadow-sm">
      {/* Top Bar de Servicios y Ayuda */}
      <div className="bg-light border-bottom py-1 small">
        <Container className="d-flex justify-content-end">
          <Nav>
            <Nav.Link
              as={Link}
              to="/info/soporte"
              className="text-secondary me-3"
            >
              <i className="bi bi-headset me-1"></i> Ayuda al Cliente
            </Nav.Link>
            <Nav.Link as={Link} to="/track" className="text-secondary">
              <i className="bi bi-geo-alt-fill me-1"></i> Rastrea tu Pedido
            </Nav.Link>
          </Nav>
        </Container>
      </div>

      {/* Navbar Principal - fondo blanco */}
      <Navbar bg="white" expand="lg" className="py-3">
        <Container>
          <Navbar.Brand
            as={Link}
            to="/"
            className="fw-bold fs-1 text-primary display-4"
          >
            MACROSUR
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {/* 1. Barra de Búsqueda Centrada */}
            <Form
              className="d-flex mx-auto flex-grow-1"
              onSubmit={handleSearch}
              style={{ maxWidth: '600px' }}
            >
              <InputGroup>
                <Form.Control
                  type="search"
                  placeholder="Buscar alfombras, cortinas, accesorios..."
                  className="me-2 rounded-start"
                  aria-label="Search"
                  name="searchQuery"
                />
                <Button
                  variant="primary"
                  type="submit"
                  className="rounded-end"
                >
                  <i className="bi bi-search"></i>
                </Button>
              </InputGroup>
            </Form>

            {/* 2. Iconos de Usuario y Carrito */}
            <Nav className="ms-auto d-flex align-items-center">
              {/* Menú de Usuario */}
              {isAuthenticated ? (
                <Dropdown align="end" className="me-2">
                  <Dropdown.Toggle
                    variant="light"
                    id="dropdown-basic"
                    className="rounded-pill px-3"
                  >
                    <i className="bi bi-person-circle me-1"></i>
                    {user?.name || 'Mi Cuenta'}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {userRole === 'CLIENTE' && (
                      <>
                        <Dropdown.Item as={Link} to="/profile">
                          Mi Perfil
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/profile/orders">
                          Mis Pedidos
                        </Dropdown.Item>
                      </>
                    )}
                    {(userRole === 'ADMIN' || userRole === 'GESTOR') && (
                      <>
                        <Dropdown.Item
                          as={Link}
                          to="/admin/dashboard"
                          className="text-danger"
                        >
                          Panel Admin
                        </Dropdown.Item>
                        <Dropdown.Divider />
                      </>
                    )}
                    <Dropdown.Item onClick={logout}>
                      Cerrar Sesión
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <>
                  <Nav.Link
                    as={Link}
                    to="/login"
                    className="btn btn-outline-primary me-2 rounded-pill px-3"
                  >
                    Iniciar Sesión
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/admin/login"
                    className="btn btn-outline-danger me-2 rounded-pill px-3 d-none d-lg-inline"
                  >
                    Admin Login
                  </Nav.Link>
                </>
              )}

              {/* Mini Carrito */}
              <Dropdown align="end" className="ms-2">
                <Dropdown.Toggle
                  as={Nav.Link}
                  className="position-relative"
                  id="cart-dropdown"
                >
                  {/* 👇 Carrito en azul */}
                  <i className="bi bi-cart3 fs-4 text-primary"></i>
                  {cartCount > 0 && (
                    <Badge
                      bg="danger"
                      pill
                      className="position-absolute top-0 start-100 translate-middle"
                    >
                      {cartCount}
                    </Badge>
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu style={{ minWidth: '300px' }}>
                  {cartCount === 0 ? (
                    <span className="dropdown-item text-muted">
                      Tu carrito está vacío
                    </span>
                  ) : (
                    <>
                      {cartItems.slice(0, 3).map((item) => (
                        <Dropdown.Item
                          key={item.id}
                          className="d-flex align-items-center"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: '40px',
                              height: '40px',
                              objectFit: 'cover',
                              marginRight: '10px',
                            }}
                          />
                          <div className="flex-grow-1">
                            <div className="fw-semibold">{item.name}</div>
                            <small>
                              {item.quantity} x ${item.price}
                            </small>
                          </div>
                        </Dropdown.Item>
                      ))}
                      <Dropdown.Divider />
                      <div className="px-3 py-2">
                        <div className="d-flex justify-content-between fw-bold">
                          <span>Total:</span>
                          <span>${subtotal}</span>
                        </div>
                        <Button
                          as={Link}
                          to="/cart"
                          variant="primary"
                          className="w-100 mt-2"
                        >
                          Ver Carrito
                        </Button>
                      </div>
                    </>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Navbar de Categorías */}
      <Navbar bg="dark" variant="dark" className="py-0 d-none d-lg-block">
        <Container>
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/catalogo?c=alfombras"
              className="fw-semibold"
            >
              Alfombras
            </Nav.Link>
            <Nav.Link as={Link} to="/catalogo?c=cortinas">
              Cortinas
            </Nav.Link>
            <Nav.Link as={Link} to="/catalogo?c=accesorios">
              Accesorios
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/info/nuestras-tiendas"
              className="text-warning fw-semibold"
            >
              Nuestras Tiendas
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
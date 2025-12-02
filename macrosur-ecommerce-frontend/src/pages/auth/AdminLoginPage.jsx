import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Intentar iniciar sesión como ADMIN (isAdmin: true) con opción recordarme
        const success = await login(email, password, true, rememberMe); 
        
        if (success) {
            // El AuthContext ya debería haber validado que el rol es ADMIN/GESTOR
            navigate('/admin/dashboard'); 
        } else {
            setError('Acceso denegado. Credenciales de administrador incorrectas.');
        }
    };

    return (
        <Container className="py-5 bg-light min-vh-100">
            <Card className="shadow-lg mx-auto" style={{ maxWidth: '400px' }}>
                <Card.Header className="bg-dark text-white text-center">
                    <h3 className="mb-0 fw-bold">Panel de Administración MACROSUR</h3>
                </Card.Header>
                <Card.Body className="p-4">
                    <p className="text-muted small text-center mb-4">Ingrese con su cuenta corporativa (@macrosur.com)</p>
                    
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="adminEmail">
                            <Form.Label>Correo Corporativo</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="ejemplo@macrosur.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="adminPassword">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="rememberMe">
                            <Form.Check
                                type="checkbox"
                                label="Recordar mi sesión (24 horas)"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <Form.Text className="text-muted small">
                                Sin marcar: sesión expira en 2 horas o al cerrar el navegador
                            </Form.Text>
                        </Form.Group>

                        <Button variant="danger" type="submit" className="w-100 mb-3">
                            Ingresar al Sistema
                        </Button>
                    </Form>
                    
                    <div className="text-center">
                        <Button variant="outline-secondary" size="sm" as={Link} to="/">
                            ← Volver al sitio principal
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AdminLoginPage;
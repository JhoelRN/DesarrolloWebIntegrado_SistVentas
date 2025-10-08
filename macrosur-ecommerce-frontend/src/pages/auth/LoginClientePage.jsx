import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LoginClientePage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Intentar iniciar sesión como CLIENTE (isAdmin: false)
        const success = await login(email, password, false); 
        
        if (success) {
            navigate('/profile');
        } else {
            setError('Credenciales inválidas. Por favor, verifica tu correo y contraseña.');
        }
    };

    return (
        <Container className="py-5" style={{ maxWidth: '450px' }}>
            <Card className="shadow-lg">
                <Card.Body className="p-4">
                    <h2 className="text-center mb-4 fw-bold text-primary">Acceso de Clientes</h2>
                    
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Correo Electrónico</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Escribe tu correo"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="formBasicPassword">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100 mb-3">
                            Ingresar
                        </Button>
                    </Form>

                    <div className="text-center mt-3">
                        <Link to="/forgot-password" className="d-block small text-secondary">
                            ¿Olvidaste tu contraseña?
                        </Link>
                        <hr />
                        <p className="small mb-0">¿Eres nuevo en MACROSUR?</p>
                        <Link to="/register" className="fw-semibold">
                            Crea tu cuenta aquí
                        </Link>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default LoginClientePage;
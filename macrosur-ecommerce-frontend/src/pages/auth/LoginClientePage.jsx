import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { loginManual, loginConGoogle, loginConMicrosoft } from '../../api/clientAuth';

const LoginClientePage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Login manual de cliente (no de administrador)
            const clienteData = await loginManual(email, password);
            
            console.log('✅ Login exitoso:', clienteData);
            
            // Redirigir al perfil del cliente
            navigate('/cliente/perfil');
        } catch (err) {
            console.error('❌ Error en login:', err);
            setError(typeof err === 'string' ? err : 'Credenciales inválidas. Por favor, verifica tu correo y contraseña.');
        } finally {
            setLoading(false);
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

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="rememberMeClient">
                            <Form.Check
                                type="checkbox"
                                label="Mantener sesión iniciada"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <Form.Text className="text-muted small">
                                Recomendado solo en dispositivos personales
                            </Form.Text>
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100 mb-3" disabled={loading}>
                            {loading ? 'Ingresando...' : 'Ingresar'}
                        </Button>
                    </Form>

                    <div className="text-center my-3">
                        <span className="text-muted">───── o ─────</span>
                    </div>

                    <div className="d-grid gap-2">
                        <Button
                            variant="outline-secondary"
                            className="d-flex align-items-center justify-content-center gap-2"
                            disabled
                            style={{ opacity: 0.5, cursor: 'not-allowed' }}
                            onClick={loginConGoogle}
                        >
                            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                                <path fill="#9E9E9E" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                                <path fill="#9E9E9E" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                                <path fill="#9E9E9E" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.335z"/>
                                <path fill="#9E9E9E" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                            </svg>
                            Continuar con Google <small>(Próximamente)</small>
                        </Button>

                        <Button
                            variant="outline-secondary"
                            className="d-flex align-items-center justify-content-center gap-2"
                            disabled
                            style={{ opacity: 0.5, cursor: 'not-allowed' }}
                            onClick={loginConMicrosoft}
                        >
                            <svg width="21" height="21" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                                <path fill="#9E9E9E" d="M0 0h10v10H0z"/>
                                <path fill="#9E9E9E" d="M11 0h10v10H11z"/>
                                <path fill="#9E9E9E" d="M0 11h10v10H0z"/>
                                <path fill="#9E9E9E" d="M11 11h10v10H11z"/>
                            </svg>
                            Continuar con Microsoft <small>(Próximamente)</small>
                        </Button>
                    </div>

                    <div className="text-center mt-4">
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
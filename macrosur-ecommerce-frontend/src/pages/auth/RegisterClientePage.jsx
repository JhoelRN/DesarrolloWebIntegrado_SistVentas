import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { registrarCliente } from '../../api/clientAuth';

const RegisterClientePage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        correo: '',
        contrasena: '',
        confirmarContrasena: '',
        telefono: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validaciones
        if (!formData.nombre || !formData.apellido || !formData.correo || !formData.contrasena) {
            setError('Por favor completa todos los campos obligatorios');
            return;
        }

        if (formData.contrasena !== formData.confirmarContrasena) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (formData.contrasena.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.correo)) {
            setError('Por favor ingresa un correo electrónico válido');
            return;
        }

        setLoading(true);
        try {
            const clienteData = {
                nombre: formData.nombre,
                apellido: formData.apellido,
                correo: formData.correo,
                contrasena: formData.contrasena,
                telefono: formData.telefono || null
            };

            await registrarCliente(clienteData);
            
            // Mostrar mensaje de éxito y redirigir al login
            alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
            navigate('/login');
        } catch (err) {
            console.error('Error en registro:', err);
            setError(err.response?.data?.message || 'Error al registrar usuario. Verifica tus datos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={6} lg={5}>
                    <Card>
                        <Card.Body className="p-4">
                            <h2 className="text-center mb-4">Crear Cuenta</h2>
                            
                            {error && <Alert variant="danger">{error}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        placeholder="Ingresa tu nombre"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Apellido *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="apellido"
                                        value={formData.apellido}
                                        onChange={handleChange}
                                        placeholder="Ingresa tu apellido"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Correo Electrónico *</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="correo"
                                        value={formData.correo}
                                        onChange={handleChange}
                                        placeholder="ejemplo@correo.com"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Teléfono (Opcional)</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        placeholder="987654321"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Contraseña *</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="contrasena"
                                        value={formData.contrasena}
                                        onChange={handleChange}
                                        placeholder="Mínimo 6 caracteres"
                                        required
                                    />
                                    <Form.Text className="text-muted">
                                        Mínimo 6 caracteres
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Confirmar Contraseña *</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="confirmarContrasena"
                                        value={formData.confirmarContrasena}
                                        onChange={handleChange}
                                        placeholder="Repite tu contraseña"
                                        required
                                    />
                                </Form.Group>

                                <Button 
                                    variant="primary" 
                                    type="submit" 
                                    className="w-100 mb-3"
                                    disabled={loading}
                                >
                                    {loading ? 'Registrando...' : 'Crear Cuenta'}
                                </Button>

                                <div className="text-center">
                                    <span className="text-muted">¿Ya tienes cuenta? </span>
                                    <Link to="/login">Inicia sesión aquí</Link>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default RegisterClientePage;

/**
 * Selector de Promociones para Checkout
 * Permite aplicar promociones activas al pedido y calcula el descuento
 */

import React, { useState, useEffect } from 'react';
import { Form, Card, Badge, Alert, Spinner } from 'react-bootstrap';
import { obtenerPromocionesActivas, calcularDescuento } from '../../api/promociones';

const PromotionSelector = ({ subtotal, onPromotionApplied }) => {
    const [promociones, setPromociones] = useState([]);
    const [promocionSeleccionada, setPromocionSeleccionada] = useState(null);
    const [descuentoCalculado, setDescuentoCalculado] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        cargarPromociones();
    }, []);

    useEffect(() => {
        if (promocionSeleccionada && subtotal > 0) {
            calcularDescuentoPromocion();
        } else {
            setDescuentoCalculado(0);
            onPromotionApplied(null, 0);
        }
    }, [promocionSeleccionada, subtotal]);

    const cargarPromociones = async () => {
        try {
            const data = await obtenerPromocionesActivas();
            setPromociones(data);
        } catch (err) {
            console.error('Error cargando promociones:', err);
            setError('No se pudieron cargar las promociones');
        } finally {
            setLoading(false);
        }
    };

    const calcularDescuentoPromocion = async () => {
        if (!promocionSeleccionada) return;

        try {
            // Calcular descuento según tipo
            const promo = promociones.find(p => p.reglaId === parseInt(promocionSeleccionada));
            if (!promo) return;

            let descuento = 0;

            switch(promo.tipoDescuento) {
                case 'Porcentaje':
                    descuento = subtotal * (promo.valorDescuento / 100);
                    break;
                case 'Monto_Fijo':
                    descuento = parseFloat(promo.valorDescuento);
                    break;
                case 'Dos_X_Uno':
                    // Para 2x1, el descuento es aproximadamente 50% del subtotal
                    // (asumiendo que el cliente compra al menos 2 productos)
                    descuento = subtotal * 0.5;
                    break;
                case 'Envio_Gratis':
                    // El descuento del envío se maneja aparte en el componente padre
                    descuento = 0;
                    break;
                default:
                    descuento = 0;
            }

            // No permitir descuento mayor al subtotal
            descuento = Math.min(descuento, subtotal);

            setDescuentoCalculado(descuento);
            onPromotionApplied(promo, descuento);

        } catch (err) {
            console.error('Error calculando descuento:', err);
            setError('Error al calcular el descuento');
        }
    };

    const handlePromocionChange = (e) => {
        const value = e.target.value;
        setPromocionSeleccionada(value || null);
        setError('');
    };

    const getPromoDescription = (promo) => {
        switch(promo.tipoDescuento) {
            case 'Porcentaje':
                return `${promo.valorDescuento}% de descuento`;
            case 'Monto_Fijo':
                return `$${parseFloat(promo.valorDescuento).toLocaleString('es-CL')} de descuento`;
            case 'Dos_X_Uno':
                return '2x1 en productos seleccionados';
            case 'Envio_Gratis':
                return 'Envío gratis';
            default:
                return 'Descuento especial';
        }
    };

    const getBadgeColor = (tipo) => {
        switch(tipo) {
            case 'Porcentaje': return 'primary';
            case 'Monto_Fijo': return 'success';
            case 'Dos_X_Uno': return 'info';
            case 'Envio_Gratis': return 'warning';
            default: return 'secondary';
        }
    };

    if (loading) {
        return (
            <Card className="mb-3">
                <Card.Body className="text-center">
                    <Spinner animation="border" size="sm" className="me-2" />
                    Cargando promociones...
                </Card.Body>
            </Card>
        );
    }

    if (promociones.length === 0) {
        return null; // No mostrar el selector si no hay promociones
    }

    return (
        <Card className="mb-3 border-success">
            <Card.Header className="bg-success text-white">
                <i className="bi bi-gift me-2"></i>
                <strong>¿Tienes una promoción?</strong>
            </Card.Header>
            <Card.Body>
                <Form.Group>
                    <Form.Label>Selecciona una promoción:</Form.Label>
                    <Form.Select 
                        value={promocionSeleccionada || ''} 
                        onChange={handlePromocionChange}
                        className="mb-3"
                    >
                        <option value="">Sin promoción</option>
                        {promociones.map(promo => (
                            <option key={promo.reglaId} value={promo.reglaId}>
                                {promo.nombreRegla} - {getPromoDescription(promo)}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                {promocionSeleccionada && (
                    <>
                        {/* Información de la promoción seleccionada */}
                        {promociones.filter(p => p.reglaId === parseInt(promocionSeleccionada)).map(promo => (
                            <Alert key={promo.reglaId} variant="success" className="mb-2">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{promo.nombreRegla}</strong>
                                        <br />
                                        <small>{getPromoDescription(promo)}</small>
                                        {promo.exclusivo && (
                                            <div className="mt-1">
                                                <Badge bg="warning" text="dark">
                                                    No acumulable
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-end">
                                        <Badge bg={getBadgeColor(promo.tipoDescuento)} className="fs-6">
                                            {promo.tipoDescuento === 'Envio_Gratis' 
                                                ? 'Envío Gratis'
                                                : `-$${descuentoCalculado.toLocaleString('es-CL')}`
                                            }
                                        </Badge>
                                    </div>
                                </div>

                                {/* Días restantes */}
                                {promo.diasRestantes !== null && promo.diasRestantes <= 7 && (
                                    <div className="mt-2">
                                        <small className="text-danger">
                                            <i className="bi bi-clock-history me-1"></i>
                                            {promo.diasRestantes === 0 
                                                ? '¡Último día!' 
                                                : `Quedan ${promo.diasRestantes} días`
                                            }
                                        </small>
                                    </div>
                                )}
                            </Alert>
                        ))}

                        {/* Descuento calculado */}
                        {descuentoCalculado > 0 && (
                            <div className="text-success fw-bold">
                                <i className="bi bi-check-circle me-2"></i>
                                Ahorro: ${descuentoCalculado.toLocaleString('es-CL')}
                            </div>
                        )}
                    </>
                )}

                {error && (
                    <Alert variant="danger" className="mb-0 mt-2">
                        {error}
                    </Alert>
                )}

                {/* Promociones disponibles */}
                {!promocionSeleccionada && (
                    <div className="mt-3">
                        <small className="text-muted">
                            <i className="bi bi-info-circle me-1"></i>
                            Tienes {promociones.length} {promociones.length === 1 ? 'promoción disponible' : 'promociones disponibles'}
                        </small>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};

export default PromotionSelector;

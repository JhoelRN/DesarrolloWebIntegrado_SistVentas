/**
 * Banner de Promociones para HomePage
 * Carrusel animado con promociones activas de la base de datos
 * 
 * REQUISITOS DE IMÁGENES:
 * - Colocar imágenes en: public/images/promotions/
 * - Nombrar como: promocion-{id}.jpg (ej: promocion-1.jpg)
 * - Tamaño recomendado: 1920x400px o 1200x300px
 * - Formato: JPG, PNG o WebP
 * 
 * Si no hay imagen personalizada, usa gradiente con el nombre de la promoción
 */

import React, { useState, useEffect } from 'react';
import { Carousel, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { obtenerPromocionesActivas } from '../../api/promociones';
import './PromotionBanner.css';

const PromotionBanner = () => {
    const [promociones, setPromociones] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        cargarPromociones();
    }, []);

    const cargarPromociones = async () => {
        try {
            const data = await obtenerPromocionesActivas();
            // Limitar a 5 promociones principales
            setPromociones(data.slice(0, 5));
        } catch (error) {
            console.error('Error cargando promociones:', error);
            // Mostrar banner por defecto si falla
            setPromociones([]);
        } finally {
            setLoading(false);
        }
    };

    const getBackgroundImage = (promo) => {
        // Intentar cargar imagen personalizada
        const imagePath = `/images/promotions/promocion-${promo.reglaId}.jpg`;
        return imagePath;
    };

    const getGradientColor = (tipo) => {
        switch(tipo) {
            case 'Porcentaje': return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            case 'Monto_Fijo': return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
            case 'Dos_X_Uno': return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
            case 'Envio_Gratis': return 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
            default: return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }
    };

    const getDescriptionText = (promo) => {
        switch(promo.tipoDescuento) {
            case 'Porcentaje':
                return `¡${promo.valorDescuento}% de descuento en toda la tienda!`;
            case 'Monto_Fijo':
                return `¡Ahorra $${promo.valorDescuento.toLocaleString('es-CL')} en tu compra!`;
            case 'Dos_X_Uno':
                return '¡Lleva 2 y paga solo 1! Oferta por tiempo limitado';
            case 'Envio_Gratis':
                return '¡Envío gratis en todos los pedidos!';
            default:
                return '¡Aprovecha esta oferta exclusiva!';
        }
    };

    const calcularDiasRestantes = (fechaFin) => {
        if (!fechaFin) return null;
        const hoy = new Date();
        const fin = new Date(fechaFin);
        const dias = Math.ceil((fin - hoy) / (1000 * 60 * 60 * 24));
        return dias > 0 ? dias : 0;
    };

    // Banner por defecto si no hay promociones
    if (!loading && promociones.length === 0) {
        return (
            <div className="promotion-banner-default" style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                height: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textAlign: 'center'
            }}>
                <div>
                    <h1 className="display-3 fw-bold mb-3">MACROSUR</h1>
                    <h3 className="mb-4">Tu tienda de confianza en decoración del hogar</h3>
                    <Button 
                        variant="light" 
                        size="lg" 
                        onClick={() => navigate('/productos')}
                        className="px-5 py-3"
                    >
                        <i className="bi bi-shop me-2"></i>
                        Explorar Productos
                    </Button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div style={{ height: '400px', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando promociones...</span>
                </div>
            </div>
        );
    }

    return (
        <Carousel fade interval={5000} className="promotion-banner">
            {promociones.map((promo) => {
                const diasRestantes = calcularDiasRestantes(promo.fechaFin);
                
                return (
                    <Carousel.Item key={promo.reglaId}>
                        <div 
                            className="promotion-slide"
                            style={{
                                height: '400px',
                                background: getGradientColor(promo.tipoDescuento),
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Intentar cargar imagen de fondo */}
                            <img 
                                src={getBackgroundImage(promo)}
                                alt={promo.nombreRegla}
                                className="promotion-bg-image"
                                onError={(e) => {
                                    // Si no existe la imagen, ocultar el elemento
                                    e.target.style.display = 'none';
                                }}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    zIndex: 1
                                }}
                            />
                            
                            {/* Overlay oscuro para mejorar legibilidad */}
                            <div 
                                className="promotion-overlay"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    background: 'rgba(0,0,0,0.3)',
                                    zIndex: 2
                                }}
                            />

                            {/* Contenido del banner */}
                            <Carousel.Caption 
                                className="promotion-content"
                                style={{ 
                                    zIndex: 3,
                                    bottom: '50%',
                                    transform: 'translateY(50%)'
                                }}
                            >
                                {/* Badge de urgencia */}
                                {diasRestantes !== null && diasRestantes <= 7 && (
                                    <div className="mb-3">
                                        <span className="badge bg-danger fs-6 px-4 py-2 pulse-animation">
                                            <i className="bi bi-clock-history me-2"></i>
                                            {diasRestantes === 0 ? '¡ÚLTIMO DÍA!' : `¡Quedan ${diasRestantes} días!`}
                                        </span>
                                    </div>
                                )}

                                {/* Título principal */}
                                <h1 className="display-4 fw-bold mb-3 text-white text-shadow">
                                    {promo.nombreRegla}
                                </h1>

                                {/* Descripción */}
                                <p className="fs-4 mb-4 text-white">
                                    {getDescriptionText(promo)}
                                </p>

                                {/* Call to Action */}
                                <div className="d-flex gap-3 justify-content-center">
                                    <Button 
                                        variant="light" 
                                        size="lg" 
                                        onClick={() => navigate('/productos')}
                                        className="px-5 py-3 fw-bold btn-hover-grow"
                                    >
                                        <i className="bi bi-cart-plus me-2"></i>
                                        Comprar Ahora
                                    </Button>
                                    <Button 
                                        variant="outline-light" 
                                        size="lg" 
                                        onClick={() => navigate('/admin/promotions')}
                                        className="px-5 py-3 fw-bold"
                                    >
                                        Ver Detalles
                                    </Button>
                                </div>

                                {/* Términos */}
                                {promo.exclusivo && (
                                    <p className="mt-3 small text-white-50">
                                        * Oferta no acumulable con otras promociones
                                    </p>
                                )}
                            </Carousel.Caption>
                        </div>
                    </Carousel.Item>
                );
            })}
        </Carousel>
    );
};

export default PromotionBanner;

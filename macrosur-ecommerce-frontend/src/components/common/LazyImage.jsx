/**
 * LazyImage Component
 * 
 * Componente optimizado para carga diferida de imágenes
 * - Lazy loading nativo del navegador
 * - Placeholder mientras carga
 * - Manejo de errores con imagen por defecto
 * - Optimización de URLs de Unsplash
 */

import React, { useState, useEffect, useRef } from 'react';
import { Spinner } from 'react-bootstrap';

const LazyImage = ({ src, alt, className = '', style = {}, ...props }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [currentSrc, setCurrentSrc] = useState(src);
    const loadTimeoutRef = useRef(null);

    // Resetear estado cuando cambia la URL de la imagen
    useEffect(() => {
        setCurrentSrc(src);
        setLoading(true);
        setError(false);
        setRetryCount(0);
        
        // Timeout de seguridad: si no carga en 10 segundos, marcar como error
        loadTimeoutRef.current = setTimeout(() => {
            if (loading) {
                console.warn('⏱️ Timeout cargando imagen:', src);
                setLoading(false);
                setError(true);
            }
        }, 10000);
        
        return () => {
            if (loadTimeoutRef.current) {
                clearTimeout(loadTimeoutRef.current);
            }
        };
    }, [src]);

    // Optimizar URL según el tipo de fuente
    const optimizeImageUrl = (url) => {
        if (!url) return 'https://placehold.co/400x300/e9ecef/6c757d?text=Sin+Imagen';
        
        // Si es una ruta local (/uploads/**), construir URL completa
        if (url.startsWith('/uploads/')) {
            return `http://localhost:8081${url}`;
        }
        
        // Si es de Unsplash y no tiene parámetros completos, agregar optimización
        if (url.includes('unsplash.com') && !url.includes('fm=webp')) {
            if (url.includes('?')) {
                return `${url}&q=75&fm=webp&fit=crop`;
            } else {
                return `${url}?w=400&q=75&fm=webp&fit=crop`;
            }
        }
        
        // Si es de Picsum, asegurar que use webp
        if (url.includes('picsum.photos') && !url.includes('.webp')) {
            return url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        }
        
        return url;
    };

    const optimizedSrc = optimizeImageUrl(currentSrc);
    const errorSrc = 'https://placehold.co/400x300/e9ecef/6c757d?text=Sin+Imagen';

    const handleLoad = () => {
        if (loadTimeoutRef.current) {
            clearTimeout(loadTimeoutRef.current);
        }
        setLoading(false);
        setError(false);
    };

    const handleError = () => {
        if (loadTimeoutRef.current) {
            clearTimeout(loadTimeoutRef.current);
        }
        
        console.warn(`Error cargando imagen: ${currentSrc}`);
        
        // Intentar retry una vez con la URL original sin optimizaciones
        if (retryCount === 0 && optimizedSrc !== src) {
            console.log('Reintentando con URL original...');
            setRetryCount(1);
            setCurrentSrc(src);
            setLoading(true);
            return;
        }
        
        // Si ya se intentó, mostrar error inmediatamente
        setLoading(false);
        setError(true);
    };

    return (
        <div style={{ position: 'relative', ...style }}>
            {loading && !error && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1
                    }}
                >
                    <Spinner animation="border" size="sm" variant="primary" />
                </div>
            )}
            <img
                src={error ? errorSrc : optimizedSrc}
                alt={alt}
                className={className}
                style={{
                    ...style,
                    opacity: loading ? 0.3 : 1,
                    transition: 'opacity 0.3s ease-in-out',
                    display: 'block',
                    width: '100%'
                }}
                loading="lazy"
                onLoad={handleLoad}
                onError={handleError}
                {...props}
            />
        </div>
    );
};

export default LazyImage;

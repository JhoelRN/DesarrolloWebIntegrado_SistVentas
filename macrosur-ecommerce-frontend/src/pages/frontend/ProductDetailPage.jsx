import React from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const ProductDetailPage = () => {
    const { sku } = useParams();
    return (
        <Container className="my-5">
            <h1>Detalle del Producto</h1>
            <p>Mostrando detalles para el SKU: <strong>{sku}</strong> (Componente Stub).</p>
        </Container>
    );
};

export default ProductDetailPage;
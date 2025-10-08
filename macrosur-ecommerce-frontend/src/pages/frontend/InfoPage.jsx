import React from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const InfoPage = () => {
    const { slug } = useParams();
    return (
        <Container className="my-5">
            <h1>Contenido Informativo</h1>
            <p>Cargando información para el slug: <strong>{slug}</strong> (Componente Stub).</p>
        </Container>
    );
};

export default InfoPage;

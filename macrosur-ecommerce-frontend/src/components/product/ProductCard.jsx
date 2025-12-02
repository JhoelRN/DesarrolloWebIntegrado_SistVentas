import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import LazyImage from '../common/LazyImage';

const ProductCard = ({ product }) => {
    const hasFichaTecnica = product.fichaTecnica && 
                           product.fichaTecnica.trim() !== '' && 
                           product.fichaTecnica.trim() !== '<p><br></p>';

    return (
        <Card className="shadow-sm h-100 product-card border-0 transition">
            <Link to={`/producto/${product.id}`} className="text-decoration-none">
                <div className="p-2 position-relative">
                    <LazyImage 
                        src={product.image} 
                        alt={product.name} 
                        style={{ height: '200px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    {hasFichaTecnica && (
                        <Badge 
                            bg="info" 
                            className="position-absolute top-0 end-0 m-3"
                            style={{ fontSize: '0.7rem' }}
                        >
                            <i className="bi bi-file-earmark-text"></i> Ficha Técnica
                        </Badge>
                    )}
                </div>
            </Link>
            <Card.Body className="d-flex flex-column">
                <Card.Title className="fs-6 fw-semibold mb-1">
                    <Link to={`/producto/${product.id}`} className="text-dark text-decoration-none hover-primary">
                        {product.name}
                    </Link>
                </Card.Title>
                {product.description && (
                    <p className="text-muted small mb-2" style={{ 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        display: '-webkit-box', 
                        WebkitLineClamp: 2, 
                        WebkitBoxOrient: 'vertical' 
                    }}>
                        {product.description}
                    </p>
                )}
                <div className="mt-auto">
                    <div className="d-flex align-items-baseline mb-2">
                        <span className="fs-5 fw-bold text-danger me-2">${product.price.toFixed(2)}</span>
                        {product.oldPrice && (
                            <span className="text-muted text-decoration-line-through small">
                                ${product.oldPrice.toFixed(2)}
                            </span>
                        )}
                    </div>
                    <Button variant="primary" size="sm" className="w-100">
                        <i className="bi bi-bag-plus-fill me-1"></i> Añadir
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default ProductCard;

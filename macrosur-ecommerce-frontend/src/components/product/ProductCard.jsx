import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    return (
        <Card className="shadow-sm h-100 product-card border-0 transition">
            <Link to={`/producto/${product.id}`} className="text-decoration-none">
                <Card.Img 
                    variant="top" 
                    src={product.image} 
                    alt={product.name} 
                    style={{ height: '200px', objectFit: 'cover' }}
                    className="p-2"
                />
            </Link>
            <Card.Body className="d-flex flex-column">
                <Card.Title className="fs-6 fw-semibold mb-1">
                    <Link to={`/producto/${product.id}`} className="text-dark text-decoration-none hover-primary">
                        {product.name}
                    </Link>
                </Card.Title>
                <div className="mt-auto">
                    <div className="d-flex align-items-baseline mb-2">
                        <span className="fs-5 fw-bold text-danger me-2">S/ {product.price.toFixed(2)}</span>
                        {product.oldPrice && (
                            <span className="text-muted text-decoration-line-through small">
                                S/ {product.oldPrice.toFixed(2)}
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

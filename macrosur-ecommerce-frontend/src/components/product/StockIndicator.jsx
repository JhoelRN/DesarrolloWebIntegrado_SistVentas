import React from 'react';
import { Badge, ProgressBar } from 'react-bootstrap';

const StockIndicator = ({ stock, minStock = 5 }) => {
  // Si no se pasa stock, asumimos que hay (o se maneja externamente)
  if (stock === undefined || stock === null) return null;

  if (stock === 0) {
    return (
        <div className="d-flex align-items-center text-danger">
            <i className="bi bi-x-circle-fill me-2"></i>
            <span className="fw-bold">Agotado</span>
        </div>
    );
  }

  if (stock <= minStock) {
    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-1 text-warning">
            <span>
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                ¡Solo quedan {stock} unidades!
            </span>
        </div>
        <ProgressBar variant="warning" now={(stock / (minStock * 2)) * 100} style={{ height: '5px' }} />
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center text-success">
        <i className="bi bi-check-circle-fill me-2"></i>
        <span className="fw-bold">Disponible ({stock} en stock)</span>
    </div>
  );
};

export default StockIndicator;
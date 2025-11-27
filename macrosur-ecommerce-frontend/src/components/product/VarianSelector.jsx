import React from 'react';
import { Button } from 'react-bootstrap';

const VariantSelector = ({ variants, selectedVariant, onSelect }) => {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="mb-3">
      <label className="fw-bold mb-2">Opciones disponibles:</label>
      <div className="d-flex flex-wrap gap-2">
        {variants.map((variant, index) => {
          const isSelected = selectedVariant && selectedVariant.id === variant.id;
          return (
            <Button
              key={variant.id || index}
              variant={isSelected ? "primary" : "outline-secondary"}
              size="sm"
              onClick={() => onSelect(variant)}
              className="d-flex align-items-center"
              style={{ minWidth: '40px', justifyContent: 'center' }}
            >
              {variant.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default VariantSelector;
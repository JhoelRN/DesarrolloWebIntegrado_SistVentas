import React from 'react';

/**
 * Componente para mostrar/seleccionar calificación con estrellas
 * Soporta modo lectura y edición
 */
const StarRating = ({ rating, onRatingChange, readOnly = false, size = 'md' }) => {
  const stars = [1, 2, 3, 4, 5];
  
  const sizeClasses = {
    sm: 'fs-6',
    md: 'fs-5',
    lg: 'fs-4',
    xl: 'fs-3'
  };

  const handleClick = (value) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleKeyDown = (e, value) => {
    if (!readOnly && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleClick(value);
    }
  };

  return (
    <div className="star-rating d-inline-flex align-items-center">
      {stars.map((star) => (
        <span
          key={star}
          onClick={() => handleClick(star)}
          onKeyDown={(e) => handleKeyDown(e, star)}
          role={readOnly ? 'img' : 'button'}
          tabIndex={readOnly ? -1 : 0}
          aria-label={`${star} ${star === 1 ? 'estrella' : 'estrellas'}`}
          className={`star ${sizeClasses[size]} ${readOnly ? '' : 'star-interactive'}`}
          style={{
            color: star <= rating ? '#ffc107' : '#e4e5e9',
            cursor: readOnly ? 'default' : 'pointer',
            margin: '0 2px',
            transition: 'color 0.2s, transform 0.2s',
            userSelect: 'none'
          }}
          onMouseEnter={(e) => {
            if (!readOnly) e.target.style.transform = 'scale(1.2)';
          }}
          onMouseLeave={(e) => {
            if (!readOnly) e.target.style.transform = 'scale(1)';
          }}
        >
          {star <= rating ? '★' : '☆'}
        </span>
      ))}
      {rating > 0 && (
        <span className="ms-2 text-muted small">
          ({rating}/5)
        </span>
      )}
    </div>
  );
};

export default StarRating;

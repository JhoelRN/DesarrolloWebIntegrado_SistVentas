import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Este componente no renderiza nada visual.
 * Su único trabajo es escuchar los cambios de ruta (URL)
 * y llevar el scroll de la ventana hacia arriba (0, 0).
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
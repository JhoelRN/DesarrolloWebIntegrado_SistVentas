import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { procesarCallbackOAuth } from '../../api/clientAuth';

const OAuthCallbackPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const procesarCallback = async () => {
      try {
        // Obtener el hash de la URL (OAuth2 implicit flow)
        const hash = window.location.hash;

        if (!hash) {
          setError('No se recibieron datos de autenticación. Por favor, intente nuevamente.');
          return;
        }

        console.log('🔐 Procesando callback OAuth...');

        // Procesar el callback
        const resultado = await procesarCallbackOAuth(hash);

        console.log('✅ Login OAuth exitoso:', resultado);

        // Obtener la URL de destino guardada antes de redirigir a OAuth
        const destino = localStorage.getItem('oauth_redirect_after_login') || '/';
        localStorage.removeItem('oauth_redirect_after_login');

        // Pequeño delay para asegurar que el localStorage se actualice
        setTimeout(() => {
          navigate(destino, { replace: true });
        }, 100);

      } catch (err) {
        console.error('❌ Error en callback OAuth:', err);
        setError(err.response?.data?.message || err.message || 'Error al procesar la autenticación');
      }
    };

    procesarCallback();
  }, [navigate]);

  if (error) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="text-center" style={{ maxWidth: '500px' }}>
          <Alert variant="danger">
            <Alert.Heading>Error de Autenticación</Alert.Heading>
            <p>{error}</p>
            <hr />
            <div className="d-flex justify-content-center gap-2">
              <Button
                variant="outline-danger"
                onClick={() => navigate('/cliente/login')}
              >
                Volver al Login
              </Button>
              <Button
                variant="danger"
                onClick={() => window.location.href = '/'}
              >
                Ir al Inicio
              </Button>
            </div>
          </Alert>
        </div>
      </Container>
    );
  }

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Spinner animation="border" variant="primary" style={{ width: '4rem', height: '4rem' }} />
      <h3 className="mt-4">Completando inicio de sesión...</h3>
      <p className="text-muted">Por favor espere mientras procesamos su autenticación.</p>
    </Container>
  );
};

export default OAuthCallbackPage;

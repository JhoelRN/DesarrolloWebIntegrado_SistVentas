import React from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';

const DashboardAdminPage = () => {
  
  const testReport = async (reportType) => {
    try {
      // El token se guarda como 'authToken' según el AuthContext
      const token = localStorage.getItem('authToken');
      
      console.log('🔍 Debugging localStorage:');
      console.log('- token:', localStorage.getItem('token'));
      console.log('- authToken:', localStorage.getItem('authToken'));
      console.log('- user:', localStorage.getItem('user'));
      console.log('🔑 Final token:', token ? 'Present' : 'Missing');
      
      if (!token) {
        alert('No token found. Please login first.');
        return;
      }
      
      const response = await fetch(`http://localhost:8081/api/reports/${reportType}?formato=PDF`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📊 Response status:', response.status);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_${reportType}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        console.log('✅ Report downloaded successfully');
        alert('¡Reporte descargado exitosamente!');
      } else {
        const errorText = await response.text();
        console.error('❌ Error:', response.status, errorText);
        alert(`Error ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Error: ' + error.message);
    }
  };
  
  return (
    <Container>
      <h2>Dashboard Principal</h2>
      <p>Vista principal para administradores (Componente Stub).</p>
      
      <Card className="mt-4">
        <Card.Header>
          <h5>📊 Pruebas de Reportes JasperReports</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={3}>
              <Button 
                variant="primary" 
                className="w-100 mb-2"
                onClick={() => testReport('usuarios')}
              >
                👥 Usuarios
              </Button>
            </Col>
            <Col md={3}>
              <Button 
                variant="success" 
                className="w-100 mb-2"
                onClick={() => testReport('productos')}
              >
                📦 Productos
              </Button>
            </Col>
            <Col md={3}>
              <Button 
                variant="warning" 
                className="w-100 mb-2"
                onClick={() => testReport('inventario')}
              >
                📋 Inventario
              </Button>
            </Col>
            <Col md={3}>
              <Button 
                variant="info" 
                className="w-100 mb-2"
                onClick={() => testReport('ventas')}
              >
                💰 Ventas
              </Button>
            </Col>
          </Row>
          
          <div className="mt-3">
            <small className="text-muted">
              ℹ️ Los reportes se descargarán como PDF. Revisa la consola (F12) para logs detallados.
            </small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DashboardAdminPage;

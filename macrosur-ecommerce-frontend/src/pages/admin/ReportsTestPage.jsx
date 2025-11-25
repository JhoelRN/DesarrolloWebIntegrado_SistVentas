import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ReportsTestPage = () => {
  const { user } = useAuth();
  
  const downloadReport = async (reportType) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('No hay token. Asegúrate de estar logueado.');
        return;
      }
      
      console.log('🔑 Token encontrado:', token);
      
      const response = await fetch(`http://localhost:8081/api/reports/${reportType}?formato=PDF`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_${reportType}_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        console.log('✅ Reporte descargado exitosamente');
      } else {
        console.error('❌ Error:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error details:', errorText);
        alert(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ Error descargando reporte:', error);
      alert('Error descargando reporte: ' + error.message);
    }
  };
  
  return (
    <div className="container mt-4">
      <h2>🧪 Pruebas de Reportes</h2>
      <p><strong>Usuario actual:</strong> {user?.correo} ({user?.role?.nombreRol})</p>
      
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>📊 Reportes Disponibles</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-primary" 
                  onClick={() => downloadReport('usuarios')}
                >
                  👥 Reporte de Usuarios (Solo ADMIN)
                </button>
                
                <button 
                  className="btn btn-success" 
                  onClick={() => downloadReport('productos')}
                >
                  📦 Reporte de Productos 
                </button>
                
                <button 
                  className="btn btn-warning" 
                  onClick={() => downloadReport('inventario')}
                >
                  📋 Reporte de Inventario
                </button>
                
                <button 
                  className="btn btn-info" 
                  onClick={() => downloadReport('ventas')}
                >
                  💰 Reporte de Ventas
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>🔍 Debug Info</h5>
            </div>
            <div className="card-body">
              <p><strong>Token presente:</strong> {localStorage.getItem('token') ? '✅ Sí' : '❌ No'}</p>
              <p><strong>Rol actual:</strong> {user?.role?.nombreRol || 'No definido'}</p>
              <p><strong>Permisos:</strong> {user?.permissions?.length || 0} permisos</p>
              
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  const token = localStorage.getItem('token');
                  console.log('🔑 Token completo:', token);
                  alert('Token copiado a la consola');
                }}
              >
                🔍 Ver Token en Consola
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsTestPage;
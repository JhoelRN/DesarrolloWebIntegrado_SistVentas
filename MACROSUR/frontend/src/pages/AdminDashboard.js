import React from 'react';

function AdminDashboard({ onLogout }) {
  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Panel de Administración</h1>
        <button onClick={onLogout}>Cerrar Sesión</button>
      </header>
      <div className="admin-content">
        <aside className="admin-sidebar">
          <ul>
            <li>Dashboard</li>
            <li>Productos</li>
            <li>Pedidos</li>
            <li>Usuarios</li>
          </ul>
        </aside>
        <main className="dashboard-main">
          <h2>Dashboard</h2>
          <p>Bienvenido al panel de administración. Aquí podrás gestionar los productos, pedidos y usuarios.</p>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
import React, { useState } from 'react';

function LoginPage({ onGoBack, onLogin, onCreateAccountClick }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Lógica de validación
    if (email === 'admin' && password === '1234') {
      onLogin('Administrador', 'admin');
    } else if (email.endsWith('@empresa.com')) {
      onLogin(email, 'employee'); // Asume que todos los correos de empresa son empleados
    } else {
      // Por ahora, cualquier otra combinación es un cliente
      // Aquí se podría implementar una validación real con base de datos
      onLogin(email, 'client');
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <h2 className="login-title">Iniciar sesión</h2>
        <div className="login-logo">
          <span className="logo-text">R.com</span>
        </div>
        <p className="welcome-text">¡BIENVENIDO a Rlpley.com!</p>
        <p className="login-prompt">Ingresa tu usuario y contraseña para iniciar sesión</p>
        <form className="login-form" onSubmit={handleLoginSubmit}>
          <input className="input-field" type="text" placeholder="Correo o DNI*" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input-field" type="password" placeholder="Contraseña*" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
          <button type="submit" className="login-button">Iniciar sesión</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <div className="divider">
          <span>O</span>
        </div>
        <button className="social-login-button google">
          <span className="social-icon">G</span> Iniciar sesión con Google
        </button>
        <button className="social-login-button apple">
          <span className="social-icon"></span> Iniciar sesión con Apple
        </button>
        <p className="signup-prompt">
          ¿Eres nuevo en Ripley.com? <button onClick={onCreateAccountClick} className="signup-link-button">Crea tu cuenta</button>
        </p>
        <button onClick={onGoBack} className="back-button">← Volver</button>
      </div>
    </div>
  );
}

export default LoginPage;

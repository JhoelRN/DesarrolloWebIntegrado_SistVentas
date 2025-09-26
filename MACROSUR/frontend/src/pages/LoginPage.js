import React from 'react';

function LoginPage({ onGoBack }) {
  return (
    <div className="login-page-container">
      <div className="login-card">
        <h2 className="login-title">Iniciar sesión</h2>
        <div className="login-logo">
          <span className="logo-text">R.com</span>
        </div>
        <p className="welcome-text">¡BIENVENIDO a Rlpley.com!</p>
        <p className="login-prompt">Ingresa tu usuario y contraseña para iniciar sesión</p>
        <form className="login-form">
          <input className="input-field" type="email" placeholder="Correo o DNI*" required />
          <input className="input-field" type="password" placeholder="Contraseña*" required />
          <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
          <button type="submit" className="login-button">Iniciar sesión</button>
        </form>
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
          ¿Eres nuevo en Ripley.com? <a href="#" className="signup-link">Crea tu cuenta</a>
        </p>
        <button onClick={onGoBack} className="back-button">← Volver</button>
      </div>
    </div>
  );
}

export default LoginPage;

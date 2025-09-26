import React, { useState } from 'react';

function CreateAccountPage({ onGoBack, onLoginSuccess }) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleCreateAccount = (e) => {
    e.preventDefault();
    if (acceptedTerms) {
      alert("Cuenta creada con éxito. Redirigiendo al inicio.");
      onLoginSuccess();
    } else {
      alert("Debes aceptar los términos y condiciones.");
    }
  };

  return (
    <div className="create-account-page-container">
      <div className="create-account-card">
        <h2 className="create-account-title">Crea tu cuenta</h2>
        <div className="login-logo">
          <span className="logo-text">MACROSUR</span>
        </div>
        <p className="welcome-text">¡Regístrate y disfruta de nuestros beneficios y una experiencia de compra más rápida y sencilla!</p>
        <form className="create-account-form" onSubmit={handleCreateAccount}>
          <input className="input-field" type="text" placeholder="Nombre*" required />
          <input className="input-field" type="text" placeholder="Apellido*" required />
          <input className="input-field" type="text" placeholder="DNI*" required />
          <input className="input-field" type="tel" placeholder="Teléfono*" required />
          <input className="input-field" type="email" placeholder="Correo*" required />
          <input className="input-field" type="password" placeholder="Crea tu contraseña*" required />
          <div className="terms-checkbox">
            <input type="checkbox" id="terms" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} />
            <label htmlFor="terms">He leído y acepto los <a href="#">términos y condiciones</a> y <a href="#">política de privacidad</a></label>
          </div>
          <button type="submit" className="create-account-button">Crear cuenta</button>
        </form>
        <button onClick={onGoBack} className="back-button">← Volver</button>
      </div>
    </div>
  );
}

export default CreateAccountPage;
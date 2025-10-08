import AppRouter from './router/AppRouter';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import 'bootstrap/dist/css/bootstrap.min.css'; 

function App() {
  return (
    // 1. Proveedor de Autenticación: Gestiona la sesión (Cliente o Admin)
    <AuthProvider>
      {/* 2. Proveedor de Carrito: Gestiona el estado del carrito */}
      <CartProvider>
        {/* 3. Router Principal: Define y protege las rutas */}
        <AppRouter />
      </CartProvider>
    </AuthProvider>
  );
}

export default App

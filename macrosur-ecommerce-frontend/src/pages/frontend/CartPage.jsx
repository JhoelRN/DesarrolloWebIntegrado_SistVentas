// src/pages/CartPage.jsx
import React from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import { useCart } from "../../contexts/CartContext";

const CartPage = () => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();

  return (
    <Container className="my-5">
      <h1 className="fw-bold mb-4">Tu Carrito</h1>

      {cartItems.length === 0 ? (
        <p className="text-muted">El carrito está vacío.</p>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td className="d-flex align-items-center">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '50px',
                          height: '50px',
                          objectFit: 'cover',
                          marginRight: '10px',
                        }}
                      />
                    )}
                    {item.name}
                  </td>
                  <td>${item.price}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      style={{ width: '70px' }}
                    />
                  </td>
                  <td>${item.price * item.quantity}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <h4>Total: ${cartTotal}</h4>
            <div>
              <Button variant="outline-danger" onClick={clearCart} className="me-2">
                Vaciar Carrito
              </Button>
              <Button variant="success">Proceder al Pago</Button>
            </div>
          </div>
        </>
      )}
    </Container>
  );
};

export default CartPage;
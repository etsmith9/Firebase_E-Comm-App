import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { orderService } from '../services/orderService';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      const order = {
        userId: currentUser.uid,
        items: items.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        })),
        totalPrice: totalPrice,
        createdAt: Date.now()
      };

      const orderId = await orderService.createOrder(order);
      if (orderId) {
        clearCart();
        navigate('/orders');
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('Failed to create order. Please try again.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-container">
        <h2>Your Cart</h2>
        <div className="cart-empty">
          <p>Your cart is empty</p>
          <button onClick={() => navigate('/products')}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {items.map(item => (
          <div key={item.product.id} className="cart-item">
            <div className="cart-item-details">
              <h3 className="cart-item-title">{item.product.name}</h3>
              <p className="cart-item-price">${item.product.price}</p>
              <div className="quantity-controls">
                <button
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                >
                  -
                </button>
                <span className="quantity-value">{item.quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                >
                  +
                </button>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.product.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="summary-row">
          <span className="summary-label">Total:</span>
          <span className="summary-value">${totalPrice.toFixed(2)}</span>
        </div>
        <button className="checkout-btn" onClick={handleCheckout}>
          Place Order
        </button>
      </div>
    </div>
  );
} 
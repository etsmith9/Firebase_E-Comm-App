import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { removeFromCart, updateQuantity, clearCart } from '../store/cartSlice';

const ShoppingCart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleCheckout = () => {
    dispatch(clearCart());
    alert('Thank you for your purchase! Your order has been placed.');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container cart-container">
        <h2 className="cart-title">Your Shopping Cart</h2>
        <p className="cart-empty">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="container cart-container">
      <h2 className="cart-title">Your Shopping Cart</h2>
      
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img
              src={item.image}
              alt={item.title}
              className="cart-item-image"
            />
            <div className="cart-item-details">
              <h3 className="cart-item-title">{item.title}</h3>
              <p className="cart-item-price">${item.price.toFixed(2)}</p>
              <div className="quantity-controls">
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  className="quantity-btn"
                >
                  -
                </button>
                <span className="quantity-value">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            </div>
            <div>
              <p className="product-price">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span className="summary-label">Total Items:</span>
          <span className="summary-value">{totalItems}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Total Price:</span>
          <span className="summary-value">${totalPrice.toFixed(2)}</span>
        </div>
        <button
          onClick={handleCheckout}
          className="checkout-btn"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default ShoppingCart; 
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ShoppingCart from '../ShoppingCart';

// Mock the Redux store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      cart: (state = initialState) => state,
    },
  });
};

describe('ShoppingCart Component', () => {
  const mockCartItems = [
    {
      id: 1,
      name: 'Test Product',
      price: 99.99,
      quantity: 2,
      image: 'test-image.jpg',
    },
  ];

  it('renders cart items correctly', () => {
    const store = createMockStore({ items: mockCartItems });
    
    render(
      <Provider store={store}>
        <ShoppingCart />
      </Provider>
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('displays empty cart message when cart is empty', () => {
    const store = createMockStore({ items: [] });
    
    render(
      <Provider store={store}>
        <ShoppingCart />
      </Provider>
    );

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });
}); 
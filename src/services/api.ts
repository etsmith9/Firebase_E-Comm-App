import type { Product } from '../store/cartSlice';

const BASE_URL = 'https://fakestoreapi.com';

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${BASE_URL}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

export const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
  const response = await fetch(`${BASE_URL}/products/category/${category}`);
  if (!response.ok) {
    throw new Error('Failed to fetch products by category');
  }
  return response.json();
};

export const fetchCategories = async (): Promise<string[]> => {
  const response = await fetch(`${BASE_URL}/products/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
}; 
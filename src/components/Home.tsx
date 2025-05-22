import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { fetchProducts, fetchProductsByCategory, fetchCategories } from '../services/api';
import { addToCart } from '../store/cartSlice';
import type { Product } from '../store/cartSlice';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const dispatch = useDispatch();

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: () => selectedCategory ? fetchProductsByCategory(selectedCategory) : fetchProducts(),
  });

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
  };

  return (
    <div className="container home-container">
      <div className="category-select">
        <label htmlFor="category">Select Category</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.image}
              alt={product.title}
              className="product-image"
            />
            <h3 className="product-title">{product.title}</h3>
            <p className="product-description">{product.description}</p>
            <div className="product-rating">
              <span className="rating-star">★</span>
              <span>{product.rating.rate}</span>
              <span className="rating-count">({product.rating.count})</span>
            </div>
            <p className="product-price">${product.price.toFixed(2)}</p>
            <button
              onClick={() => handleAddToCart(product)}
              className="add-to-cart-btn"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home; 
import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { Link } from 'react-router-dom';

export default function Home() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getAllProducts
  });

  if (isLoading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="home-container">
      <h1>Welcome to Our Store</h1>
      <div className="featured-products">
        <h2>Featured Products</h2>
        <div className="products-grid">
          {products?.slice(0, 4).map((product) => (
            <div key={product.id} className="product-card">
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-price">${product.price}</p>
              <Link to={`/products`} className="view-products-btn">
                Shop and View All Products
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
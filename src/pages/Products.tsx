import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/productService';
import type { Product } from '../services/productService';
import { useCart } from '../contexts/CartContext';

export default function Products() {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const queryClient = useQueryClient();
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getAllProducts
  });

  const { addToCart } = useCart();
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const createProductMutation = useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsAddingProduct(false);
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, product }: { id: string; product: Partial<Product> }) =>
      productService.updateProduct(id, product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setEditingProduct(null);
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const product = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      stock: Number(formData.get('stock'))
    };

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, product });
    } else {
      createProductMutation.mutate(product);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div className="products-container">
      <div className="products-header">
        <h2>Products</h2>
        <button onClick={() => setIsAddingProduct(true)}>Add Product</button>
      </div>

      {(isAddingProduct || editingProduct) && (
        <div className="product-form-container">
          <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={editingProduct?.name}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                defaultValue={editingProduct?.description}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                defaultValue={editingProduct?.price}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="stock">Stock</label>
              <input
                type="number"
                id="stock"
                name="stock"
                defaultValue={editingProduct?.stock}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit">
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingProduct(false);
                  setEditingProduct(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="products-grid">
        {products?.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p className="price">${product.price}</p>
            <p className="stock">Stock: {product.stock}</p>
            <div className="product-actions">
              <button onClick={() => setEditingProduct(product)}>Edit</button>
              <button
                onClick={() => deleteProductMutation.mutate(product.id)}
                className="delete"
              >
                Delete
              </button>
            </div>
            <button
              className={`add-to-cart-btn ${addedProductId === product.id ? 'added' : ''}`}
              onClick={() => handleAddToCart(product)}
            >
              {addedProductId === product.id ? 'Added to Cart!' : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 

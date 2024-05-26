import React, { useState, useEffect } from 'react';
import './NonVerifiedProducts.css'
interface Product {
  id: number;
  productName: string;
  // Add other properties if present in the API response
}

const NonVerifiedProducts = () => {
  const [nonVerifiedProducts, setNonVerifiedProducts] = useState<Product[]>([]);

  const fetchNonVerifiedProducts = async () => {
    try {
      const response = await fetch('https://localhost:7063/api/Product/nonverified');
      if (!response.ok) {
        throw new Error('Failed to fetch non-verified products');
      }
      const data: Product[] = await response.json();
      setNonVerifiedProducts(data);
    } catch (error) {
      console.error('Error fetching non-verified products:', error);
    }
  };

  useEffect(() => {
    fetchNonVerifiedProducts();
  }, []);

  const handleVerify = async (productId: number) => {
    try {
        console.log("testttt")
      const response = await fetch(`https://localhost:7063/api/Product/verify/${productId}`, {
        method: 'PUT', // Assuming the API endpoint for verification is a PUT request
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to verify product');
      }
      // If verification is successful, fetch the updated list of non-verified products
      fetchNonVerifiedProducts();
    } catch (error) {
      console.error('Error verifying product:', error);
    }
  };

  return (
    <div className="non-verified-products">
      <h2>Non-Verified Products</h2>
      <div className="product-grid">
        {nonVerifiedProducts.map(product => (
          <div className="product-item" key={product.id}>
            <div className="product-details">
              <h3>{product.productName}</h3>
              <button className="NonButton"onClick={() => handleVerify(product.id)}>Verify</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NonVerifiedProducts;

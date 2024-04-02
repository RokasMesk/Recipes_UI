import React, { useState, useEffect } from 'react';
import './RecipeCreationModal.css';

interface Product {
  id: number;
  productName: string;
}

interface RecipeCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RecipeCreationModal: React.FC<RecipeCreationModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    imageUrl: '',
    products: [] as Product[],
    selectedProducts: [] as Product[],
    preparation: '',
    skillLevel: '',
    timeForCooking: 0,
    type: 0
  });

  useEffect(() => {
    fetchProducts();
  }, []); 

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://localhost:7063/api/Product');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data: Product[] = await response.json();
      setFormData({ ...formData, products: data });
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProductClick = (selectedProduct: Product) => {
    if (formData.selectedProducts.includes(selectedProduct)) {
      // Product is already selected, remove it
      const updatedSelectedProducts = formData.selectedProducts.filter(product => product !== selectedProduct);
      setFormData({ ...formData, selectedProducts: updatedSelectedProducts });
    } else {
      // Product is not selected, add it
      setFormData({ ...formData, selectedProducts: [...formData.selectedProducts, selectedProduct] });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const author = localStorage.getItem('email')
    // Extracting only the ingredient IDs from selected products
    const ingredientIds = formData.selectedProducts.map(product => product.id);
    const recipeData = {
      title: formData.title,
      shortDescription: formData.shortDescription,
      description: formData.description,
      imageUrl: formData.imageUrl,
      products: ingredientIds, // Sending only the ingredient IDs
      preparation: formData.preparation,
      skillLevel: formData.skillLevel,
      timeForCooking: formData.timeForCooking,
      type: formData.type,
      author:author
    };
  
    console.log(recipeData);
  
    fetch('https://localhost:7063/api/Recipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recipeData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to create recipe');
      }
      onClose();
    })
    .catch(error => {
      console.error('There was a problem creating the recipe:', error);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>X</button>
        <h1>Create a Recipe</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title:</label>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Short Description:</label>
            <input type="text" name="shortDescription" value={formData.shortDescription} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Image URL:</label>
            <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Preparation:</label>
            <textarea name="preparation" value={formData.preparation} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Skill Level:</label>
            <input type="text" name="skillLevel" value={formData.skillLevel} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Time for Cooking (minutes):</label>
            <input type="number" name="timeForCooking" value={formData.timeForCooking} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Type:</label>
            <input type="number" name="type" value={formData.type} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Select Products:</label>
            <ul>
              {formData.products.map(product => (
                <li key={product.id}>
                  <label>
                    <input 
                      type="checkbox" 
                      checked={formData.selectedProducts.includes(product)} 
                      onChange={() => handleProductClick(product)} 
                    />
                    {product.productName}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <button type="submit">Create Recipe</button>
        </form>
      </div>
    </div>
  );
};

export default RecipeCreationModal;

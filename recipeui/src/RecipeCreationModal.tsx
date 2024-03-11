import React, { useState } from 'react';
import './RecipeCreationModal.css';

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
    products: [],
    preparation: '',
    skillLevel: '',
    timeForCooking: 0,
    type: 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // You can handle the form submission here, e.g., send the data to the server
    console.log(formData);
    // Assuming you have an API endpoint to post the data, you can use fetch or any other HTTP client library to send a POST request
    fetch('https://localhost:7063/api/Recipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to create recipe');
      }
      // Close the modal after successful submission
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
          <button type="submit">Create Recipe</button>
        </form>
      </div>
    </div>
  );
};

export default RecipeCreationModal;
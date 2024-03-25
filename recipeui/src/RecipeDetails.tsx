// RecipeDetails.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Recipe } from './App';
import './RecipeDetails.css'; // Import CSS for styling

function RecipeDetails() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const { id } = useParams<{ id: string }>();
  const apiUrl = `https://localhost:7063/api/Recipe/${id}`;

  useEffect(() => {
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: Recipe) => {
        setRecipe(data);
      })
      .catch(error => {
        console.error('There was a problem fetching data:', error);
      });
  }, [apiUrl]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div className="recipe-details-container">
      <h2 className="title">Title: {recipe.title}</h2>
      <div className="image-container">
        <img src={recipe.imageUrl} alt={recipe.title} className="image" />
      </div>
      <div className="description">
        <h3>Short Description:</h3>
        <p>{recipe.shortDescription}</p>
        <h3>Description:</h3>
        <p>{recipe.description}</p>
      </div>
      <div className="products">
        <h3>Products:</h3>
        <ul>
          {recipe.products.map(product => (
            <li key={product.id}>{product.productName}</li>
          ))}
        </ul>
      </div>
      <div className="preparation">
        <h3>Preparation:</h3>
        <p>{recipe.preparation}</p>
      </div>
      <div className="additional-details">
        <p><strong>Skill Level:</strong> {recipe.skillLevel}</p>
        <p><strong>Time for Cooking:</strong> {recipe.timeForCooking} minutes</p>
        <p><strong>Type: </strong> {recipe.type.type}</p>
      </div>
      <button>Delete</button>
    </div>
  );
}

export default RecipeDetails;

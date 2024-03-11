// RecipeBox.tsx
import React from 'react';
import { Recipe } from './App'; // Import the Recipe interface if needed
import './App.css'; // Import CSS for styling

interface RecipeBoxProps {
  recipe: Recipe;
}

function RecipeBox({ recipe }: RecipeBoxProps) {
  return (
    <div className="recipe-box">
      <img src={recipe.imageUrl} alt={recipe.shortDescription} />
      <div className="recipe-info">
        <h3>{recipe.title}</h3> {/* Updated to display title */}
        <p>{recipe.description}</p>
        <h4>Products:</h4>
        <ul>
          {recipe.products.map(product => (
            <li key={product.id}>{product.productName}</li>
          ))}
        </ul>
        <h4>Preparation:</h4>
        <p>{recipe.preparation}</p>
        <p>Skill Level: {recipe.skillLevel}</p>
        <p>Time for Cooking: {recipe.timeForCooking} minutes</p>
        <p>Type: {recipe.type.type}</p>
      </div>
    </div>
  );
}

export default RecipeBox;

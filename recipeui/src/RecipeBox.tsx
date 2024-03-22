// RecipeBox.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Recipe } from './App';
import './App.css';

interface RecipeBoxProps {
  recipe: Recipe;
}

function RecipeBox({ recipe }: RecipeBoxProps) {
  return (
    <div className="recipe-box">
      <img src={recipe.imageUrl} alt={recipe.shortDescription} />
      <div className="recipe-info">
        <h3>{recipe.title}</h3>
        <p>{recipe.description}</p>
        <h4>Products:</h4>
        <ul>
          {recipe.products.map(product => (
            <li key={product.id}>{product.productName}</li>
          ))}
        </ul>
        <Link to={`/recipe/${recipe.id}`} className="see-more-button">
          See more
        </Link>
      </div>
    </div>
  );
}

export default RecipeBox;

import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import RecipeBox from './RecipeBox'; // Your RecipeBox component
import { Recipe } from './App';
import './App.css';

// interface Recipe {
//   id: number;
//   title: string;
//   // Add other properties if present in the API response
// }

const NonVerifiedRecipes = () => {
  const [nonVerifiedRecipes, setNonVerifiedRecipes] = useState<Recipe[]>([]);

  const fetchNonVerifiedRecipes = async () => {
    try {
      const response = await fetch('https://localhost:7063/api/Recipe/nonverified');
      if (!response.ok) {
        throw new Error('Failed to fetch non-verified Recipe');
      }
      const data: Recipe[] = await response.json();
      setNonVerifiedRecipes(data);
    } catch (error) {
      console.error('Error fetching non-verified Recipe:', error);
    }
  };

  useEffect(() => {
    fetchNonVerifiedRecipes();
  }, []);

  const handleVerify = async (recipeId: number) => {
    try {
        console.log("testttt")
      const response = await fetch(`https://localhost:7063/api/Recipe/verify/${recipeId}`, {
        method: 'PUT', // Assuming the API endpoint for verification is a PUT request
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to verify recipe');
      }
      // If verification is successful, fetch the updated list of non-verified products
      fetchNonVerifiedRecipes();
    } catch (error) {
      console.error('Error verifying recipe:', error);
    }
  };

  return (
    <div className="non-verified-recipes">
      <h2>Non-Verified Recipes</h2>
      <div className="recipe-grid">
        {nonVerifiedRecipes.map(recipe => (
          <div key={recipe.id} className="recipe-item">
            <RecipeBox recipe={recipe} />
            <button onClick={() => handleVerify(recipe.id)} className="verify-button">Verify</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NonVerifiedRecipes;

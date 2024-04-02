import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Recipe } from './App';
import RecipeBox from "./RecipeBox"
import './MyRecipesPage.css'



const MyRecipesPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    // Fetch recipes for the specified username
    const fetchRecipes = async () => {
      try {
        const response = await fetch(`https://localhost:7063/api/Recipe/user/${localStorage.getItem('username')}`);
        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }
        const data: Recipe[] = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  });

  return (
    <div>
        <h2>Recipes for {localStorage.getItem('username')}</h2>
        <div className='recipe-container'>
            
            {recipes.map(recipe => (
            <RecipeBox key={recipe.id} recipe={recipe} />
            ))}
        </div>
    </div>

  );
};

export default MyRecipesPage;

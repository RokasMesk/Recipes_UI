import React, { useEffect, useState } from 'react';
import { Recipe } from './App';
import RecipeBox from "./RecipeBox";
import './MyRecipesPage.css';

const MyRecipesPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [description, setDescription] = useState<string>(''); // State to hold user description

  useEffect(() => {
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
    }, []); // Empty dependency array to run effect only once


  return (
    <div className="container">
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

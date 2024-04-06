import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Recipe } from './App';
import RecipeBox from "./RecipeBox"
import './App.css'

const MyRecipesPage: React.FC = () => {
  const [userFavorites, setUserFavorites] = useState<Recipe[]>([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) return; // Guard clause to handle the case where userId is null
    const fetchFavorites = async () => { 
      try {
        const response = await fetch(`https://localhost:7063/api/User/users/${userId}/favorites`);
        if (!response.ok) {
          throw new Error('Failed to fetch favorites');
        }

        const favorites = await response.json() as Recipe[];
        setUserFavorites(favorites);

      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites(); 
  }, [userId]); // Run the effect when userId changes

  if (!userId) {
    return null; // Render nothing if the user is not logged in
  }

  return (
    <div>
      <h2>Recipes for {localStorage.getItem('username')}</h2>
      <div className='recipe-container'>      
        {userFavorites.map(recipe => ( // Map over userFavorites
          <RecipeBox key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default MyRecipesPage;

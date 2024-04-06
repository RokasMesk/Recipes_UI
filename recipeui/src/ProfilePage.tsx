import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import RecipeBox from './RecipeBox'; // Your RecipeBox component
import { Recipe } from './App';
import './App.css';

const ProfilePage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userExists, setUserExists] = useState(true);
  const { username } = useParams();

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://localhost:7063/api/Recipe/user/${username}`);

        if (!response.ok) {
          if (response.status === 404) {
            setUserExists(false);
          } else {  
            throw new Error(`Failed to load recipes: ${response.status}`);
          }
          return; 
        }

        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        // Handle the error, display an error message
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [username]);

  if (!userExists) {
    return <Navigate to="/not-found" replace /> // Or a custom error message
  }

  return (
    <div>
      <h1>{username}'s Recipes</h1> 
      {isLoading ? (
        <p>Loading recipes...</p>
      ) : (
        <div className="recipe-container">
          {recipes.map((recipe) => (
            <RecipeBox key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

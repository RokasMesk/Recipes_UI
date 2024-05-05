import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
    
     const fetchDescription = async () => {
       try {
         const response = await fetch(`https://localhost:7063/api/User/get-description?email=${localStorage.getItem('email')}`, {
           method: 'GET',
           headers: {
             'Content-Type': 'application/json',
           },
         });
         if (!response.ok) {
           throw new Error('Failed to fetch user description');
         }
         const data = await response.json();
         setDescription(data.userDescription);
       } catch (error) {
         console.error('Error fetching user description:', error);
       }
     };
    
      fetchRecipes();
      fetchDescription();
    }, []); // Empty dependency array to run effect only once

  const handleDescriptionChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleSubmitDescription = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://localhost:7063/api/User/add-description`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: localStorage.getItem('email'), userDescription: description }),
      });
      if (!response.ok) {
        throw new Error('Failed to update description');
      }
      // Optionally, you can display a success message or update state to reflect the change
    } catch (error) {
      console.error('Error updating description:', error);
    }
  };

  return (
    <div className="container">
      <h2>Recipes for {localStorage.getItem('username')}</h2>
      <div className="description-container">
        <form onSubmit={handleSubmitDescription}>
          <label htmlFor="description">Your Description:</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={handleDescriptionChange}
          />
          <button type="submit">Save Description</button>
        </form>
        <p className="user-description">Description: {description}</p>
      </div>
      <div className='recipe-container'>
        {recipes.map(recipe => (
          <RecipeBox key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default MyRecipesPage;

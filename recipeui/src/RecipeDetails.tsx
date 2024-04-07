import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Recipe } from './App';
import './RecipeDetails.css'; // Import CSS for styling

function RecipeDetails() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const { id } = useParams<{ id: string }>();
  const apiUrl = `https://localhost:7063/api/Recipe/${id}`;
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [showEditButton, setShowEditButton] = useState(false);
  const [updatedRecipeData, setUpdatedRecipeData] = useState<any>(null); // State variable for updated recipe data

  // Fetch recipe data and set state
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

  // Determine if delete button should be shown
  useEffect(() => {
    const roles = localStorage.getItem('roles');
    if (roles) {
      const parsedRoles = JSON.parse(roles);
      if (parsedRoles.includes('Admin')) {
        setShowDeleteButton(true);
      }
    }
  }, []);

  // Determine if edit button should be shown
  useEffect(() => {
    const loggedInUser = localStorage.getItem('username');
    if (loggedInUser && recipe) {
      if (loggedInUser === recipe.recipeCreatorUserName) {
        setShowEditButton(true);
      }
    }
  }, [recipe]);

  const handleDelete = () => {
    fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete recipe');
      }
      // Navigate to the start page after successful deletion
      // Add the navigation logic here if needed
    })
    .catch(error => {
      console.error('There was a problem deleting the recipe:', error);
    });
  };

  const handleEdit = () => {
    if (updatedRecipeData) {
      fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedRecipeData)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to edit recipe');
        }
        // Handle successful edit, e.g., display a success message
      })
      .catch(error => {
        console.error('There was a problem editing the recipe:', error);
      });
    } else {
      console.error('No updated recipe data available');
    }
  };
  
  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div className="recipe-details-container">
      {/* Your rendering logic */}
      {showDeleteButton && <button type="submit" onClick={handleDelete}>Delete</button>}
      {showEditButton && (
        <button onClick={handleEdit}>Edit</button>
      )}
    </div>
  );
}

export default RecipeDetails
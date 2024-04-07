// RecipeDetails.tsx
import React, { useState, useEffect } from 'react';
import { useParams} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Recipe } from './App';
import './RecipeDetails.css'; // Import CSS for styling

function RecipeDetails() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const { id } = useParams<{ id: string }>();
  const apiUrl = `https://localhost:7063/api/Recipe/${id}`;
  const navigate = useNavigate();

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
      navigate('/');
    })
    .catch(error => {
      console.error('There was a problem deleting the recipe:', error);
    });
  };
  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };
  useEffect(() => {
    const loggedInUser = localStorage.getItem('username');
    if (loggedInUser && recipe) {
      if (loggedInUser === recipe.recipeCreatorUserName) {
        setShowEditButton(true);
      }
    }
  }, [recipe]);

  useEffect(() => {
    const roles = localStorage.getItem('roles');
    if (roles) {
      const parsedRoles = JSON.parse(roles);
      if (parsedRoles.includes('Admin')) {
        setShowDeleteButton(true);
        setShowEditButton(true);
      }
    }
  }, []);

  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [showEditButton, setShowEditButton] = useState(false);
  
  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div className="recipe-details-container">
      <h3 className='author'>Recipe author: {recipe.recipeCreatorUserName}</h3>
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
      {showDeleteButton && <button type="submit" onClick={handleDelete}>Delete</button>}
      {showEditButton && (
        <button type="submit" onClick={handleEdit}>Edit</button>
      )}
    </div>
  );
}

export default RecipeDetails;

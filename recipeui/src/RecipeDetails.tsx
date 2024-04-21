// RecipeDetails.tsx
import React, { useState, useEffect } from 'react';
import { useParams} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Recipe } from './App';
import './RecipeDetails.css'; // Import CSS for styling
import CommentsSection from './CommentsSection';

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
    <div>
    <div className="recipe-details-container-end">
      <h3 className='author-end'>Recipe author: {recipe.recipeCreatorUserName}</h3>
      <h2 className="title-end">Title: {recipe.title}</h2>
      <div className="image">
        <img src={recipe.imageUrl} alt={recipe.title} className="image-container-end" />
      </div>
      <div className="description-end">
        <h3>Short Description:</h3>
        <p>{recipe.shortDescription}</p>
      </div>
      <div className="short-end">
        <h3>Description:</h3>
        <p>{recipe.description}</p>
      </div>
      <div className="products-end">
        <h3>Products:</h3>
        <ul>
          {recipe.products.map(product => (
            <li key={product.id}>{product.productName}</li>
          ))}
        </ul>
      </div>
      <div className="preparation-end">
        <h3>Preparation:</h3>
        <p>{recipe.preparation}</p>
      </div>
      <div className="additional-details-end">
        <p><strong>Skill Level:</strong> {recipe.skillLevel}</p>
        <p><strong>Time for Cooking:</strong> {recipe.timeForCooking} minutes</p>
        <p><strong>Type: </strong> {recipe.type.type}</p>
      </div>
      {showDeleteButton && <button  className="element-button-change" type="submit" onClick={handleDelete}>Delete</button>}
      {showEditButton && (
        <button className="product-button-recipe" type="submit" onClick={handleEdit}>Edit</button>
      )}
    </div>
    <CommentsSection recipeId={recipe.id} />
    </div>
  );
}

export default RecipeDetails;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Recipe } from './App';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';

interface RecipeBoxProps {
  recipe: Recipe;
}

function RecipeBox({ recipe }: RecipeBoxProps) {
  const [userFavorites, setUserFavorites] = useState<Recipe[]>([]);
  const [isLiked, setIsLiked] = useState(false); // Initially not liked

  useEffect(() => {
    const fetchFavorites = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        return; // Do nothing if user is not logged in
      }

      try {
        const response = await fetch(`https://localhost:7063/api/User/users/${userId}/favorites`);
        if (!response.ok) {
          throw new Error('Failed to fetch favorites');
        }
        
        const favorites = await response.json() as Recipe[];
        setUserFavorites(favorites as Recipe[]);
        
        // Update the liked state based on fetched favorites
        setIsLiked(favorites.some((fav) => fav.id === recipe.id));
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, [recipe.id]); // Fetch favorites when recipe ID changes

  const toggleLike = async () => {
    setIsLiked(!isLiked);
    try {
      const userId = localStorage.getItem('userId'); 
      if (!userId) {
        throw new Error('User ID not found. Please log in.'); 
      }

      const method = isLiked ? 'DELETE' : 'POST'; // Invert method for toggling
      const url = `https://localhost:7063/api/User/users/${userId}/favorites/${recipe.id}`;

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to update like status: ${response.status}`);
      }

      // Update the userFavorites state after successful update
      const updatedFavorites = isLiked
        ? userFavorites.filter((fav) => fav.id !== recipe.id)
        : [...userFavorites, recipe];
      setUserFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error liking/unliking recipe:', error);
      setIsLiked(!isLiked); // Revert the UI change on error 
      alert('Error updating like status. Please try again.'); // Display an error alert
    }
  };

  const navigate = useNavigate(); 

  const handleAuthorClick = () => {
    navigate(`/profile/${recipe.recipeCreatorUserName}`); // Assuming 'recipeCreatorId' exists
  };

  return (
    <div className="recipe-box">
      { localStorage.getItem('isLoggedIn') === 'true' &&
        <button className="like-button" onClick={toggleLike} >
          <FontAwesomeIcon icon={isLiked ? faHeartSolid : faHeartRegular} color={isLiked ? 'red' : 'gray'} size="2x"/> 
        </button>
      }
      
      <img src={recipe.imageUrl} alt={recipe.shortDescription} />
      <div className="recipe-info">       
        <h3>{recipe.title }</h3> 
        <p>{recipe.description}</p>
        <h4>Products:</h4>
        <ul>
          {recipe.products.map(product => (
            <li key={product.id}>{product.productName}</li>
          ))}
        </ul>
        <h3 onClick={handleAuthorClick} className="author-link">Created by: {recipe.recipeCreatorUserName}</h3>
        <Link to={`/recipe/${recipe.id}`} className="see-more-button">
          See more
        </Link>
        
      </div>
    </div>
  );
}

export default RecipeBox;

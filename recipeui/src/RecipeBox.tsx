import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Recipe } from './App';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import Rating from '@mui/material/Rating';

interface RecipeBoxProps {
  recipe: Recipe;
}

function RecipeBox({ recipe }: RecipeBoxProps) {
  const [userFavorites, setUserFavorites] = useState<Recipe[]>([]);
  const [isLiked, setIsLiked] = useState(false); // Initially not liked
  const [value, setValue] = useState<number | null>(0); // Initial value for rating
  const [isRated, setIsRated] = useState<number | null>(-1);

  useEffect(() => {
    const fetchFavorites = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        return; // Do nothing if user is not logged in
      }

      try {
        const response = await fetch(`https://localhost:7063/api/User/users/${userId}/favorites`);
        if (!response.ok) {
          throw new Error('Failed to fetch favorites' + value);
        }
        
        const favorites = await response.json() as Recipe[];
        setUserFavorites(favorites as Recipe[]);
        
        // Update the liked state based on fetched favorites
        setIsLiked(favorites.some((fav) => fav.id === recipe.id));
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    const fetchRatingStatus = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          return; // Do nothing if user is not logged in
        }

        const response = await fetch(`https://localhost:7063/api/Recipe/GetRating?userId=${userId}&id=${recipe.id}`);
  
        if (!response.ok) {
          throw new Error('Failed to fetch rating status');
        }
  
        const ratingData = await response.json();
        setIsRated(ratingData); 
        console.log(ratingData);// Assuming ratingData.rating returns the rating value if rated, otherwise -1
      } catch (error) {
        console.error('Error fetching rating status:', error);
      }
    };
  
    fetchRatingStatus();
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
    <div data-testid="recipe-box" className="recipe-box">
      { localStorage.getItem('isLoggedIn') === 'true' &&
        <button data-testid="like-button" className="like-button" onClick={toggleLike} >
          <FontAwesomeIcon icon={isLiked ? faHeartSolid : faHeartRegular} color={isLiked ? 'red' : 'gray'} size="2x"/> 
        </button>
      }
      
      <img src={recipe.imageUrl} alt={recipe.shortDescription} />
      <div className="recipe-info">   
        <h3>{recipe.title }</h3> 
        <h3 data-testid="click-author" onClick={handleAuthorClick} className="author-link">Autorius: {recipe.recipeCreatorUserName}</h3>
        <h4>Bendras ivertinimas:</h4>
        <Rating
          name="simple-controlled"
          value={recipe.rating}
          readOnly
        />
        <br/>
        <h4>Mano ivertinimas:</h4>
        <Rating
        data-testid="user-rating"
          name="simple-controlled"
          value={isRated}
          onChange={(event, newValue) => {
            setValue(newValue);
            setIsRated(newValue)
            fetch('https://localhost:7063/api/Recipe/Rate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  userId: localStorage.getItem('userId'),
                  recipeId: recipe.id,
                  rating: newValue,
                }),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to rate recipe');
                    }
                })
                .catch(error => {
                    console.error('There was a problem rating the recipe:', error);
                });
              }}
        />
        <br/>
        <Link to={`/recipe/${recipe.id}`} className="see-more-button">
          Plačiau apie receptą
        </Link>
        
      </div>
    </div>
  );
}

export default RecipeBox;

import React, { useState, useEffect } from 'react';
import Header from './Header';
import RecipeBox from './RecipeBox';
import './App.css';

export interface Recipe {
  id: number;
  title: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  products: { id: number; productName: string }[];
  preparation: string;
  skillLevel: string;
  timeForCooking: number;
  type: { id: number; type: string };
}

function App() {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Initialize isLoggedIn state from localStorage
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const apiUrl = 'https://localhost:7063/api/Recipe';

  useEffect(() => {
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: Recipe[]) => {
        setRecipes(data);
      })
      .catch(error => {
        console.error('There was a problem fetching data:', error);
      });
  }, []);

  // Function to handle login success
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    // Save login status to localStorage
    localStorage.setItem('isLoggedIn', 'true');
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    // Remove login status from localStorage
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <div className="App">
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} onLoginSuccess={handleLoginSuccess} />
      <h2>Recipes</h2>
      <div className="recipe-container">
        {recipes !== null ? (
          recipes.map(recipe => (
            <RecipeBox key={recipe.id} recipe={recipe} />
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import Header from './Header';
import RecipeBox from './RecipeBox'; // Import the RecipeBox component
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

  return (
    <div className="App">
      <Header />
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

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import RecipeBox from './RecipeBox';
import RecipeDetails from './RecipeDetails';
import './App.css';
import SearchResultsList  from './SearchResultsList';
import SearchBar from './SearchBar';
import MyRecipesPage from './MyRecipesPage';
import ProfilePage from './ProfilePage';
import MyFavouritesPage from './MyFavouritesPage';
import EditRecipe from './EditRecipe';

export interface Recipe {
  productName: boolean;
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
  recipeCreatorUserName: string
}

function App() {
  const [results, setResults] = useState<Recipe[]>([]);
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
    <Router>
      <div className="App">
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} onLoginSuccess={handleLoginSuccess}/>
        <div className="search-bar-container">  
        <SearchBar setResults = {setResults}/>
        <SearchResultsList results={results}/>
        </div>
        <h2>Recipes</h2>
        <div className="recipe-container">
          <Routes>
            <Route
              path="/"
              element={
                recipes !== null ? (
                  recipes.map(recipe => (
                    <RecipeBox key={recipe.id} recipe={recipe} />
                  ))
                ) : (
                  <p data-testid="recipes-loading">Loading...</p>
                )
              }
            />
            <Route path="/recipe/:id" element={<RecipeDetails />} />
            <Route path="/edit/:id" Component={EditRecipe} />
            <Route path={`/recipes/${localStorage.getItem("username")}`} element={<MyRecipesPage/>} />
            <Route path={`/favourites/${localStorage.getItem("username")}`} element={<MyFavouritesPage/>} />
            <Route path="/profile/:username" element={<ProfilePage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

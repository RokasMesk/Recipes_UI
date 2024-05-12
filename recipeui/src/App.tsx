import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import RecipeBox from './RecipeBox';
import RecipeDetails from './RecipeDetails';
import './App.css';
import SearchResultsList from './SearchResultsList';
import SearchBar from './SearchBar';
import MyRecipesPage from './MyRecipesPage';
import ProfilePage from './ProfilePage';
import MyFavouritesPage from './MyFavouritesPage';
import EditRecipe from './EditRecipe';
import ChangePasswordPage from './ChangePasswordPage';

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
  recipeCreatorUserName: string;
  rating: number;
  ratedPeopleCount: number;
}

interface AppProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

function App({ isLoggedIn, onLogout }: AppProps) {
  const [results, setResults] = useState<Recipe[]>([]);
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
        console.log('Fetched data:', data);
        setRecipes(data);
      })
      .catch(error => {
        console.error('There was a problem fetching data:', error);
      });
  }, []);

  const handleLoginSuccess = () => {
    isLoggedIn=true;
    localStorage.setItem('isLoggedIn', 'true');
    console.log('nu prisijunge')
  };

  const handleLogout = () => {
    onLogout();
    isLoggedIn=false;
    localStorage.removeItem('isLoggedIn');
  };

  const updateRecipes = (selectedProducts: string[]) => {
    // Prepare the request body with selected products
    console.log(selectedProducts);
    // Fetch recipes based on selected products
    const searchUrl = 'https://localhost:7063/api/Recipe/search';
    fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(selectedProducts)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data: Recipe[]) => {
      console.log('Updated recipes based on selected products:', data);
      setRecipes(data);
    })
    .catch(error => {
      console.error('There was a problem fetching recipes based on selected products:', error);
    });
  };
  

  return (
    <Router>
      <div data-testid="App" className="App">
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} onLoginSuccess={handleLoginSuccess} />
        <div className="search-bar-container">
        <SearchBar setResults={setResults} updateRecipes={updateRecipes} />
          <SearchResultsList results={results} />
        </div>
        <h2>Recipes</h2>
        <div className="recipe-container">
          <Routes>
            <Route
              path="/"
              element={
                recipes !== null ? (
                  recipes.map(recipe => <RecipeBox key={recipe.id} recipe={recipe} />)
                ) : (
                  <p data-testid="recipes-loading">Loading...</p>
                )
              }
            />
            <Route path="/recipe/:id" element={<RecipeDetails />} />
            <Route path="/edit/:id" Component={EditRecipe} />
            <Route path={`/recipes/${localStorage.getItem('username')}`} element={<MyRecipesPage />} />
            <Route path={`/favourites/${localStorage.getItem('username')}`} element={<MyFavouritesPage />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
            <Route path="/password/:username" element={<ChangePasswordPage/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

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
import CreateProduct from './CreateProduct';
import NonVerifiedProducts from './NonVerifiedProducts';

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
  const [selectedRating, setSelectedRating] = useState<string>(''); // '' for no filter
  const [selectedType, setSelectedType] = useState<string>('All'); // 'All' for no filter
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Sort order for title
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

  // Filtered and sorted recipes based on selected filters and sorting order
  const filteredAndSortedRecipes = recipes?.filter(recipe => {
    // Rating filter
    if (selectedRating === 'well rated') {
      return recipe.rating >= 3; // Example: show only recipes with rating >= 3
    } else if (selectedRating === 'rated below 3') {
      return recipe.rating < 3; // Example: show only recipes with rating < 3
    }
    return true; // No rating filter selected
  }).filter(recipe => {
    if (selectedType === 'All') {
      return true; // No type filter selected
    }
    return recipe.type.type === selectedType; // Match recipes based on selected type
  }).sort((a, b) => {
    // Sort recipes by title
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();
    if (sortOrder === 'asc') {
      return titleA.localeCompare(titleB);
    } else {
      return titleB.localeCompare(titleA);
    }
  }) ?? [];

  // Set sorting order
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as 'asc' | 'desc');
  };

  return (
    <Router>
      <div data-testid="App" className="App">
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} onLoginSuccess={handleLoginSuccess} />
        <div className="filter-bar-container">
          {/* Filter controls */}
          <div className="filter-controls">
            <label>
              Rating:
              <select value={selectedRating} onChange={e => setSelectedRating(e.target.value)}>
                <option value="">No filter</option>
                <option value="well rated">Well rated</option>
                <option value="rated below 3">Rated below 3</option>
              </select>
            </label>
            <label>
              Type:
              <select value={selectedType} onChange={e => setSelectedType(e.target.value)}>
                <option value="All">All</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
              </select>
            </label>
            <label>
              Sort by title:
              <select value={sortOrder} onChange={handleSortChange}>
                <option value="asc">A-Z</option>
                <option value="desc">Z-A</option>
              </select>
            </label>
          </div>
          <SearchBar setResults={setResults} />
        </div>
        <div className="search-bar-container">
          <SearchResultsList results={results} />
        </div>
        <div className="recipe-container-front">
          <Routes>
            <Route
              path="/"
              element={
                filteredAndSortedRecipes !== null ? (
                  filteredAndSortedRecipes.map(recipe => <RecipeBox key={recipe.id} recipe={recipe} />)
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
            <Route path="/product/create" element={<CreateProduct/>} />
            <Route path="/nonverified" element={<NonVerifiedProducts/>}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
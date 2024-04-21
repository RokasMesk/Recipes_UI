import React, { useState } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import RecipeCreationModal from './RecipeCreationModal';
import LoginModal from './LoginModal';

interface HeaderProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  onLoginSuccess: (token: string) => void;
}

const apiRequest = async (url: string, requestData: any) => {
  // Implement your API request logic here using fetch or any other library
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
  });
  return response;
};

function Header({ isLoggedIn, onLogout, onLoginSuccess }: HeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const isReallyLoggedIn = localStorage.getItem('isLoggedIn');

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleLogin = () => {
    setIsLoginOpen(!isLoginOpen);
    console.log(isLoggedIn)
  };

  const toggleIsRegistering = () => {
    setIsRegistering(!isRegistering);
  }

  const handleLogout = () => {
    // Clear token or any other stored login data
    setToken(null);
    localStorage.clear();

    // Propagate logout action to parent component
    onLogout();
  };

  return (
    <header className="App-header">
      <div className="header-content">
        <div className="left">
         <Link className='receptai' to={'/'} >Receptai</Link>
        </div>
        <div className="right">
          {isReallyLoggedIn ? (
            <>
              <p className='username'>Hello, {localStorage.getItem('username')}</p>
              {localStorage.getItem("roles") && JSON.parse(localStorage.getItem("roles") ?? "[]").includes("Admin") && (
              <Link to="/nonverified" className='see-more-button link'>Verify products</Link>
              )}
              <Link to={`/password/${localStorage.getItem("username")}`} className="see-more-button link">
                  Change password?
              </Link>
              <Link to={`/recipes/${localStorage.getItem("username")}`} className="see-more-button link">
                  My Recipes
              </Link>
              <Link to={`/favourites/${localStorage.getItem("username")}`} className="see-more-button link">
                  My Favourites
              </Link>
              <button className='login' onClick={handleLogout}>Logout</button>
            </>
            
          ) : (
            <button className='login' data-testid="login-button" onClick={toggleLogin}>Login</button>
          )}
          <button className='createRecipe' data-testid="create-recipe-button" onClick={toggleModal}>Create A Recipe</button>
        </div>
      </div>
      <RecipeCreationModal isOpen={isModalOpen} onClose={toggleModal} />
      <LoginModal isOpen={isLoginOpen} onClose={toggleLogin} isRegistering={isRegistering} toggleRegistering={toggleIsRegistering} apiRequest={apiRequest} onLoginSuccess={(token: string) => { setToken(token); onLoginSuccess(token); }} />

    </header>
  );
}

export default Header;
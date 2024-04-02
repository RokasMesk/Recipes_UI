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

function Header({ isLoggedIn, onLogout, onLoginSuccess }: HeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleLogin = () => {
    setIsLoginOpen(!isLoginOpen);
  };

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
         <Link className='link' to={'/'} >Receptai</Link>
        </div>
        <div className="right">
        
          {isLoggedIn ? (
            <>
              <p className='username'>Hello, {localStorage.getItem('username')}</p>
              <Link to={`/recipes/${localStorage.getItem("username")}`} className="see-more-button">
                  My Recipes
              </Link>
              <button className='login' onClick={handleLogout}>Logout</button>
            </>
            
          ) : (
            <button className='login' onClick={toggleLogin}>Login</button>
          )}
          <button className='createRecipe' onClick={toggleModal}>Create A Recipe</button>
        </div>
      </div>
      <RecipeCreationModal isOpen={isModalOpen} onClose={toggleModal} />
      <LoginModal isOpen={isLoginOpen} onClose={toggleLogin} onLoginSuccess={(token: string) => { setToken(token); onLoginSuccess(token); }} />

    </header>
  );
}

export default Header;
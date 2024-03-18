import React, { useState } from 'react';
import './App.css';
import RecipeCreationModal from './RecipeCreationModal';
import LoginModal from './LoginModal';

interface HeaderProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  onLoginSuccess: () => void; // Add onLoginSuccess prop
}

function Header({ isLoggedIn, onLogout, onLoginSuccess }: HeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleLogin = () => {
    setIsLoginOpen(!isLoginOpen);
  };

  return (
    <header className="App-header">
      <div className="header-content">
        <div className="left">
          Receptai
        </div>
        <div className="right">
          {isLoggedIn ? (
            <button className='logout' onClick={onLogout}>Logout</button>
          ) : (
            <button className='login' onClick={toggleLogin}>Login</button>
          )}
          <button className='createRecipe' onClick={toggleModal}>Create A Recipe</button>
        </div>
      </div>
      <RecipeCreationModal isOpen={isModalOpen} onClose={toggleModal} />
      <LoginModal isOpen={isLoginOpen} onClose={toggleLogin} onLoginSuccess={onLoginSuccess} />      
    </header>
  );
}

export default Header;

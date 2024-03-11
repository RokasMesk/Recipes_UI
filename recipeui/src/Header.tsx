// Header.tsx
import React, { useState } from 'react';
import './App.css';
import RecipeCreationModal from './RecipeCreationModal';

function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <header className="App-header">
      <div className="header-content">
        <div className="left">
          Receptai
        </div>
        <div className="right">
          <button className='createRecipe' onClick={toggleModal}>Create A Recipe</button>
        </div>
      </div>
      <RecipeCreationModal isOpen={isModalOpen} onClose={toggleModal} />
    </header>
  );
}

export default Header;

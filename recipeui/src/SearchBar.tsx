import React, {useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faSearch } from '@fortawesome/free-solid-svg-icons'; // Import the search icon from Font Awesome
import './App.css';
import { Recipe } from './App';
interface SearchBarProps {
    setResults: (results: any) => void;
  }
function SearchBar({setResults} : SearchBarProps) {

    const [input, setInput] = useState("");
  
    const fetchData = (value: string) => {
        fetch("https://localhost:7063/api/Recipe")
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((json: Recipe[]) => {
            const results = json.filter((data) => {
              return (
                data &&
                value &&
                data.title && // Assuming each recipe has a 'title' property
                data.title.toLowerCase().includes(value.toLowerCase())
              );
            });
            setResults(results);
          })
          .catch((error) => {
            console.error('There was a problem fetching data:', error);
          });
      };
      
    const handleChange = (value : any) => {
      setInput(value);
      fetchData(value);
    } 
    const handleSearch = () => {
      console.log('Performing search for:', input);  setInput('');
    };
  

  
    return (

          <div className="search-input">
            <input placeholder="Search" 
            value={input}
            onChange={(e) => handleChange(e.target.value)}
            />
            <button onClick={handleSearch} className="search-button">
              <FontAwesomeIcon icon={faSearch} className="search-icon"/> {/* Search icon */}
            </button>
            </div>
    );
  }
  export default SearchBar;
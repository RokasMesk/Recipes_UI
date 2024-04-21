import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import { Recipe } from './App';

interface SearchBarProps {
  setResults: (results: Recipe[]) => void;
}

enum SearchMode {
  RecipeName = 'Recipe Name',
  ProductName = 'Product Name',
}

interface Product {
  id: number;
  productName: string;
}

function SearchBar({ setResults }: SearchBarProps) {
  const [input, setInput] = useState("");
  const [searchMode, setSearchMode] = useState(SearchMode.RecipeName);
  const [products, setProducts] = useState<Product[]>([]);
  const [productInput, setProductInput] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch("https://localhost:7063/api/Product")
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  };

  const handleProductInputChange = (value: string) => {
    setProductInput(value);
  };

  const handleProductSearch = () => {
    if (!productInput) {
      return;
    }

    const searchUrl = `https://localhost:7063/api/Recipe/search?productName=${encodeURIComponent(productInput)}`;

    // Redirect the user to the search URL
    window.location.href = searchUrl;
  };

  const handleChange = (value: string) => {
    setInput(value);
    fetchData(value, searchMode);
  };

  const fetchData = (value: string, mode: SearchMode) => {
    if (!value) {
      // If input is empty, clear the results
      setResults([]);
      return;
    }

    let endpoint = "https://localhost:7063/api/Recipe";
    if (mode === SearchMode.ProductName) {
      endpoint = "https://localhost:7063/api/Recipe/search";
    }

    fetch(endpoint)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((json: Recipe[]) => {
        const results = json.filter((data) => {
          if (mode === SearchMode.RecipeName) {
            return (
              data.title &&
              data.title.toLowerCase().includes(value.toLowerCase())
            );
          } else if (mode === SearchMode.ProductName) {
            return (
              data.products &&
              data.products.some((product) => 
                product.productName.toLowerCase().includes(value.toLowerCase())
              )
            );
          }
          return false;
        });
        setResults(results);
      })
      .catch(error => {
        console.error('There was a problem fetching data:', error);
      });
  };

  const toggleSearchMode = () => {
    setSearchMode((prevMode) => 
      prevMode === SearchMode.RecipeName ? SearchMode.ProductName : SearchMode.RecipeName
    );
  };

  return (
    <div className="search-input-main">
      <input className="search-input"
        placeholder={`Search by ${searchMode}`}
        value={searchMode === SearchMode.ProductName ? productInput : input}
        onChange={(e) => {
          if (searchMode === SearchMode.ProductName) {
            handleProductInputChange(e.target.value);
          } else {
            handleChange(e.target.value);
          }
        }}
      />
      <button onClick={searchMode === SearchMode.ProductName ? handleProductSearch : undefined} className="search-button">
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
      </button>
      <button onClick={toggleSearchMode} className="on">
        Toggle Search Mode
      </button>
      {searchMode === SearchMode.ProductName && (
        <div className='searchModeOn'>
          <h3>Select Products:</h3>
          {products.map(product => (
            <div key={product.id}>
              <input
                type="checkbox"
                id={`product-${product.id}`}
                value={product.productName}
                // Add your checkbox handling logic here
              />
              <label htmlFor={`product-${product.id}`}>{product.productName}</label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;

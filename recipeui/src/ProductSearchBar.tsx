import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './App.css';

interface Product {
    id: number;
    productName: string;
    selected: boolean;
}

interface ProductSearchBarProps {
    setResults: (results: Product[]) => void;
    setSelectedProducts: (selectedProducts: Product[]) => void; // Add setSelectedProducts function
}

const ProductSearchBar: React.FC<ProductSearchBarProps> = ({ setResults, setSelectedProducts }) => {
    const [input, setInput] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProductIds, setSelectedProductIds] = useState(new Set<number>());
    const [allProducts, setAllProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetchData(""); // Fetch products initially without search query
    }, []);

    const fetchData = (value: string) => {
        fetch("https://localhost:7063/api/Product")
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((json: Product[]) => {
                const results = json.filter((data) => {
                    return (
                        data &&
                        value &&
                        data.productName && // Assuming each product has a 'productName' property
                        data.productName.toLowerCase().includes(value.toLowerCase())
                    );
                });
                setResults(results);
                setProducts(results);
                setAllProducts(json);
            })
            .catch((error) => {
                console.error('There was a problem fetching data:', error);
            });
    };

    const handleChange = (value: string) => {
        setInput(value);
        fetchData(value);
    };

    const handleSearch = () => {
        console.log('Performing search for:', input);
        setInput('');
    };

    const handleCheckboxChange = (product: Product) => {
        const updatedIds = new Set(selectedProductIds);
        if (selectedProductIds.has(product.id)) { 
            updatedIds.delete(product.id);
        } else {
            updatedIds.add(product.id);
        }

        setSelectedProductIds(updatedIds);

        // Update selected products
        const selectedProducts = allProducts.filter(p => updatedIds.has(p.id));
        setSelectedProducts(selectedProducts);
    };

    return (
        <div className="search-input">
            <div className="search-bar">
                <input
                    placeholder="Search"
                    value={input}
                    onChange={(e) => handleChange(e.target.value)}
                />
                <button onClick={handleSearch} className="search-button">
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                </button>
            </div>
            {products.length > 0 && (
                <div className="dropdown-content">
                    {products.map((product) => (
                        <div key={product.id}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedProductIds.has(product.id)}
                                    onChange={() => handleCheckboxChange(product)}
                                />
                                {product.productName}
                            </label>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductSearchBar;

import React, { useState, useEffect } from 'react';
import './RecipeCreationModal.css';
import ProductSearchBar from './ProductSearchBar';
import { useNavigate } from 'react-router-dom';
interface Product {
    id: number;
    productName: string;
    selected: boolean;
}

interface RecipeCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RecipeCreationModal: React.FC<RecipeCreationModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        title: '',
        shortDescription: '',
        description: '',
        imageUrl: '',
        products: [] as Product[],
        selectedProducts: [] as Product[],
        preparation: '',
        skillLevel: '',
        timeForCooking: 0,
        type: 0,
        searchResults: [] as Product[],
    });
    const navigate = useNavigate();
    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        console.log('Selected Products:', formData.selectedProducts);
    }, [formData.selectedProducts]);

    const fetchProducts = async () => {
        try {
            const response = await fetch('https://localhost:7063/api/Product');
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data: Product[] = await response.json();
            setFormData({ ...formData, products: data });
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleCreateProduct = () => {
        navigate('/product/create');
    };
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const author = localStorage.getItem('email');
        // Extracting only the ingredient IDs from selected products
        const ingredientIds = formData.selectedProducts.map(product => product.id);
        const recipeData = {
            title: formData.title,
            shortDescription: formData.shortDescription,
            description: formData.description,
            imageUrl: formData.imageUrl,
            products: ingredientIds, // Sending only the ingredient IDs
            preparation: formData.preparation,
            skillLevel: formData.skillLevel,
            timeForCooking: formData.timeForCooking,
            type: formData.type,
            author: author
        };

        console.log(recipeData);

        fetch('https://localhost:7063/api/Recipe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recipeData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to create recipe');
                }
                onClose();
            })
            .catch(error => {
                console.error('There was a problem creating the recipe:', error);
            });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>X</button>
                <h1>Create a Recipe</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title:</label>
                        <input type="text" data-testid="title" name="title" value={formData.title} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Short Description:</label>
                        <input type="text" data-testid="short-description" name="shortDescription" value={formData.shortDescription} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Description:</label>
                        <textarea data-testid="description" name="description" value={formData.description} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Image URL:</label>
                        <input type="text" data-testid="image-url" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Preparation:</label>
                        <textarea data-testid="preparation" name="preparation" value={formData.preparation} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Skill Level:</label>
                        <input type="text" data-testid="skill-level" name="skillLevel" value={formData.skillLevel} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Time for Cooking (minutes):</label>
                        <input type="number" data-testid="time-for-cooking" name="timeForCooking" value={formData.timeForCooking} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Type:</label>
                        <input type="number" data-testid="type" name="type" value={formData.type} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Select Products:</label>
                        <ProductSearchBar
                            setResults={(results: Product[]) => setFormData({ ...formData, searchResults: results })}
                            setSelectedProducts={(selectedProducts: Product[]) => setFormData({ ...formData, selectedProducts: selectedProducts })}
                        />

                        <ul>
                            {formData.selectedProducts.map(product => (
                                <li key={product.id}>
                                    {product.productName}
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    
                    <button type="submit">Create Recipe</button>
                </form>
                <div className='form-group'>Cant find product?
                    <button type='submit' onClick={handleCreateProduct}>Create product</button>
                </div>
            </div>
        </div>
    );
};

export default RecipeCreationModal;

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function EditRecipe() {
  const { id } = useParams();
  const [editedRecipeData, setEditedRecipeData] = useState({
    title: "",
    description: "",
    shortDescription: "",
    preparation: "",
    skillLevel: "",
    timeForCooking: "",
    products: [] as number[], 
    Type: 3,
    imageUrl: "",
    // Other fields as needed
  });
  const [availableProducts, setAvailableProducts] = useState([] as { id: number, productName: string }[]);
  const [availableTypes, setAvailableTypes] = useState([] as { id: number, type: string }[]);

  useEffect(() => {
    // Fetch recipe data for editing based on the id parameter
    fetch(`https://localhost:7063/api/Recipe/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Set the fetched recipe data for editing
        setEditedRecipeData({
          title: data.title,
          description: data.description,
          shortDescription: data.shortDescription,
          preparation: data.preparation,
          skillLevel: data.skillLevel,
          timeForCooking: data.timeForCooking,
          products: data.products.map((product: { id: number }) => product.id),
          Type: data.Type, 
          imageUrl: data.imageUrl,// Set type field
          // Set other fields as needed
        });
      })
      .catch(error => {
        console.error('There was a problem fetching data:', error);
      });

    // Fetch available products
    fetch(`https://localhost:7063/api/Product`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Set the fetched available products
        setAvailableProducts(data);
      })
      .catch(error => {
        console.error('There was a problem fetching available products:', error);
      });

    // Fetch available types
    fetch(`https://localhost:7063/api/RecipeType`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Set the fetched available types
        setAvailableTypes(data);
      })
      .catch(error => {
        console.error('There was a problem fetching available types:', error);
      });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "products") {
      const productId = parseInt(value);
      let updatedProducts = [...editedRecipeData.products];
      if (editedRecipeData.products.includes(productId)) {
        updatedProducts = updatedProducts.filter(productId => productId !== productId);
      } else {
        updatedProducts.push(productId);
      }
      setEditedRecipeData(prevState => ({
        ...prevState,
        products: updatedProducts
      }));
    } else {
      setEditedRecipeData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Submit edited recipe data using API
    fetch(`https://localhost:7063/api/Recipe/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editedRecipeData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to edit recipe');
        }
        // Handle successful edit, e.g., display a success message
        // Redirect to the recipe details page after editing
        
        window.location.href = `/recipe/${id}`;
        for(let i=0; i < 50; i++) {
          console.log(window.location.href);
        }
      })
      .catch(error => {
        console.error('There was a problem editing the recipe:', error);
      });
  };

  if (!editedRecipeData.title || availableProducts.length === 0 || availableTypes.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="class-kazkur" style={{ textAlign: 'center', margin: 'auto', maxWidth: '600px' }}>
      {/* Form for editing recipe details */}
      <h2>Edit Recipe</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
        <label>Title:</label>
        <input type="text" data-testid="edit-title" name="title" value={editedRecipeData.title} onChange={handleChange} />
        
        <label>Short Description:</label>
        <textarea data-testid="edit-short-description" name="shortDescription" value={editedRecipeData.shortDescription} onChange={handleChange} />
        
        <label>Description:</label>
        <textarea data-testid="edit-description" name="description" value={editedRecipeData.description} onChange={handleChange} />
        
        <label>Preparation:</label>
        <textarea data-testid="edit-preparation" name="preparation" value={editedRecipeData.preparation} onChange={handleChange} />
        
        <label>Skill Level:</label>
        <select data-testid="edit-skill-level" name="skillLevel" value={editedRecipeData.skillLevel} onChange={handleChange}>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        
        <label>Time for Cooking (minutes):</label>
        <input data-testid="edit-time-for-cooking" type="number" name="timeForCooking" value={editedRecipeData.timeForCooking} onChange={handleChange} />
        
        <label>Products:</label>
        {availableProducts.map(product => (
          <div key={product.id}>
            <input
             data-testid="edit-products"
              type="checkbox"
              name="products"
              value={product.id.toString()}
              checked={editedRecipeData.products.includes(product.id)}
              onChange={handleChange}
            />
            <label>{product.productName}</label>
          </div>
        ))}
        
        <label>Type:</label>
        <select data-testid="edit-type" name="type" value={editedRecipeData.Type} onChange={handleChange}>
          {availableTypes.map(type => (
            <option key={type.id} value={type.id}>{type.type}</option>
          ))}
        </select>
  
        <label>Photo URL:</label>
        <input data-testid="edit-image-url" type="text" name="imageUrl" value={editedRecipeData.imageUrl} onChange={handleChange} />
        
        <button data-testid="edit-submit" type="submit">Save Changes</button>
        <Link to={`/recipe/${id}`}>Cancel</Link>
      </form>
    </div>
  );
}

export default EditRecipe;

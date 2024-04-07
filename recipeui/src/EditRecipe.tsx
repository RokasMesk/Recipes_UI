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
    products: [] as number[], // Specify the type as number[]
    // Other fields as needed
  });
  const [availableProducts, setAvailableProducts] = useState([] as { id: number, productName: string }[]); // Specify the type

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
          products: data.products.map((product: { id: number }) => product.id), // Ensure product.id is of type number
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
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { // Specify the event type
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => { // Specify the event type
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
      })
      .catch(error => {
        console.error('There was a problem editing the recipe:', error);
      });
  };

  if (!editedRecipeData.title || availableProducts.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Form for editing recipe details */}
      <h2>Edit Recipe</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input type="text" name="title" value={editedRecipeData.title} onChange={handleChange} />
        
        <label>Short Description:</label>
        <textarea name="shortDescription" value={editedRecipeData.shortDescription} onChange={handleChange} />
        
        <label>Description:</label>
        <textarea name="description" value={editedRecipeData.description} onChange={handleChange} />
        
        <label>Preparation:</label>
        <textarea name="preparation" value={editedRecipeData.preparation} onChange={handleChange} />
        
        <label>Skill Level:</label>
        <select name="skillLevel" value={editedRecipeData.skillLevel} onChange={handleChange}>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        
        <label>Time for Cooking (minutes):</label>
        <input type="number" name="timeForCooking" value={editedRecipeData.timeForCooking} onChange={handleChange} />
        
        <label>Products:</label>
        {availableProducts.map(product => (
          <div key={product.id}>
            <input
              type="checkbox"
              name="products"
              value={product.id.toString()} // Ensure value is of type string
              checked={editedRecipeData.products.includes(product.id)}
              onChange={handleChange}
            />
            <label>{product.productName}</label>
          </div>
        ))}
        
        {/* Other fields as needed */}
        
        <button type="submit">Save Changes</button>
        <Link to={`/recipe/${id}`}>Cancel</Link>
      </form>
    </div>
  );
}

export default EditRecipe;

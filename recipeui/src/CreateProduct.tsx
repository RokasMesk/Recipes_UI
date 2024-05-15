import React, { useState } from 'react';

const CreateProduct = () => {
    const [productName, setProductName] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            // Send request to create product
            const response = await fetch('https://localhost:7063/api/Product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productName })
            });
            if (!response.ok) {
                throw new Error('Failed to create product');
            }
            // Product created successfully
            alert('Product created successfully');
            // Clear input field
            setProductName('');
        } catch (error) {
            console.error('There was a problem creating the product:', error);
        }
    };

    const handleCancel = () => {
        // Clear input field
        setProductName('');
    };

    return (
        <div className='NewProductMain'>
            <h2>Create New Product</h2>
            <form onSubmit={handleSubmit}>
                <div className='NewProductName'>
                    <label>Product Name:</label>
                    <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                    />
                </div>
                <button className="element-button-change" type="submit">Create</button>
                <button type="button" onClick={handleCancel}>Cancel</button>
            </form>
        </div>
    );
};

export default CreateProduct;

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import 'mutationobserver-shim';

global.MutationObserver = window.MutationObserver;

jest.mock('./RecipeDetails', () => {
  const MockRecipeDetails = () => <div data-testid="recipe-details"></div>;
  MockRecipeDetails.displayName = 'MockRecipeDetails';
  return MockRecipeDetails;
});

// Helper function for mocking fetch success
const mockFetchSuccess = () => {
  global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        { 
          id: 1, 
          title: 'Test Recipe',
          // Include all required fields by the Recipe interface
          productName: true, // Assuming this is correctly typed based on your interface
          shortDescription: 'Test Short Description',
          description: 'Test Description',
          imageUrl: 'testImageUrl',
          products: [{ id: 1, productName: 'Apple' }], // Ensuring `products` is defined
          preparation: 'Test Preparation',
          skillLevel: 'Test Skill Level',
          timeForCooking: 123,
          type: { id: 1, type: "Vegan" },
          recipeCreatorUserName: 'testUser',
          rating: 4,
          ratedPeopleCount: 10,
        }
      ]),
    }))
};

// Helper function for mocking fetch failure
const mockFetchFailure = () => {
  global.fetch = jest.fn().mockImplementation(() =>
    Promise.reject(new Error('Fetch failed'))
  );
};

describe('App Component', () => {
  beforeEach(() => {
    jest.spyOn(Storage.prototype, 'getItem');
    jest.spyOn(Storage.prototype, 'setItem');
    jest.spyOn(Storage.prototype, 'removeItem');
    beforeEach(() => {
      // Mock localStorage
      Storage.prototype.getItem = jest.fn((key) => {
        if (key === 'isLoggedIn') return 'true';  // Simulate logged-in state
        return null;  // Default return value for other keys
      });
      Storage.prototype.setItem = jest.fn();
      Storage.prototype.removeItem = jest.fn();
    });
    
    afterEach(() => {
      jest.restoreAllMocks(); // Restore original functions after each test
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('fetches recipes and renders them on initial load', async () => {
    mockFetchSuccess();
    render(<App isLoggedIn={true} onLogout={() => {}} />);

    await waitFor(() => {
      expect(screen.getByTestId('recipe-box')).toHaveTextContent('Test Recipe');
    });
  });

  test('handles fetch error gracefully', async () => {
    mockFetchFailure();
    console.error = jest.fn(); // Mock console.error to check if it's called
    render(<App isLoggedIn={true} onLogout={() => {}} />);
  
    await waitFor(() => expect(console.error).toHaveBeenCalled());
    // Here you might also check for a user-facing error message, depending on your component's implementation.
  });
  

  test('renders login/logout based on isLoggedIn prop', () => {
    // Mock being logged out
    Storage.prototype.getItem = jest.fn().mockReturnValue(null);
    const { rerender } = render(<App isLoggedIn={false} onLogout={() => {}} />);
    expect(screen.queryByTestId('login-button')).toBeInTheDocument();
  
    // Mock being logged in
    Storage.prototype.getItem = jest.fn().mockReturnValue('true');
    // Use rerender to update the component under test
    rerender(<App isLoggedIn={true} onLogout={() => {}} />);
    // Now the Logout button should be in the document
    expect(screen.queryByText('Logout')).toBeInTheDocument();
  });

  test('navigates to Recipe Details page when a recipe is clicked', async () => {
    mockFetchSuccess();
    render(<App isLoggedIn={true} onLogout={() => {}} />); // Render the App component directly
  
    await waitFor(() => {
      fireEvent.click(screen.getByText('See more')); // Assuming recipe box has a clickable element
    });
  
    expect(screen.getByTestId('recipe-details')).toBeInTheDocument();
  });
  
  

  // Further tests can be added to simulate navigation, test route-specific rendering, and user interactions like clicking the logout button.
});

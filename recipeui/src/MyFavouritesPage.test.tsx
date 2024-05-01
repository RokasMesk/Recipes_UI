import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyFavouritesPage from './MyFavouritesPage';
import { Recipe } from './App';
import 'mutationobserver-shim';

global.MutationObserver = window.MutationObserver;

jest.mock('./RecipeBox', () => {
  return jest.fn(({ recipe }) => <div data-testid="recipe">{recipe.name}</div>);
});



// Helper function to mock successful fetch
const mockSuccessfulFetch = (favorites: Recipe[]) => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(favorites),
      })
    );
  };

// Helper function to mock fetch failure
const mockFetchFailure = () => {
  global.fetch = jest.fn().mockImplementation(() => Promise.reject(new Error('Fetch failed')));
};

describe('MyFavouritesPage', () => {
  beforeEach(() => {
    // Mock getItem for localStorage
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'userId') return 'testUserId';
      return null;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('fetches and displays favorites successfully', async () => {
    const favorites = [{
        id: 1,
        recipeCreatorUserName: 'testUser',
        imageUrl: 'testImageUrl',
        title: 'Test Recipe',
        description: 'Test Description',
        products: [{ id: 1, productName: 'Apple' }],
        shortDescription: 'Test Short Description',
        preparation: 'Test Preparation',
        skillLevel: 'Test Skill Level',
        timeForCooking: 123,
        type: { id: 1, type: "Vegan" },
        rating: 4, // Add a mock value for rating
        ratedPeopleCount: 10,
        productName: true
    }];
    mockSuccessfulFetch(favorites);
    render(<MyFavouritesPage />);
    await waitFor(() => {
      expect(screen.getByTestId('recipe'));
    });
  });

  test('does not attempt to fetch favorites if userId is missing', () => {
    Storage.prototype.getItem = jest.fn().mockReturnValue(null);
    render(<MyFavouritesPage />);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('handles fetch errors gracefully', async () => {
    mockFetchFailure();
    console.error = jest.fn();
    render(<MyFavouritesPage />);
    await waitFor(() => expect(console.error).toHaveBeenCalled());
    // Here, you might check for a user-facing error message, depending on your error handling strategy.
  });

  // Additional tests can include more detailed error handling, checking for proper cleanup on component unmount, etc.
});

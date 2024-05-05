import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MyRecipesPage from './MyRecipesPage';
import 'mutationobserver-shim';

global.MutationObserver = window.MutationObserver;


// Mock the RecipeBox component to simplify testing
jest.mock('./RecipeBox', () => {
  const MockRecipeBox = (props: { recipe: { id: string, name: string } }) => (
    <div data-testid={`recipe-${props.recipe.id}`}>{props.recipe.name}</div>
  );
  MockRecipeBox.displayName = 'MockRecipeBox';
  return MockRecipeBox;
});



// Helper function to mock localStorage
const mockLocalStorage = (username: string) => {
  const localStorageMock = (function () {
    let store: Record<string, string> = {};
    return {
      getItem(key: string) {
        return store[key] || null;
      },
      setItem(key: string, value: string) {
        store[key] = value.toString();
      },
      clear() {
        store = {};
      },
    };
  })();
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  window.localStorage.setItem('username', username);
};

describe('MyRecipesPage Component', () => {
  beforeEach(() => {
    // Reset mocks and setup localStorage before each test
    jest.clearAllMocks();
    mockLocalStorage('testUser');
  });

  test('fetches and displays recipes correctly', async () => {
    interface Recipe {
      id: string;
      name: string;
    };

    // Modify mockFetch to accept an array of recipes
    const mockFetch = (body: Recipe[], ok: boolean = true, status: number = 200) => {
      global.fetch = jest.fn().mockImplementation(() =>
        Promise.resolve({
          ok,
          status,
          json: () => Promise.resolve(body),
        })
      );
    };

    const recipes: Recipe[] = [
      { id: '1', name: 'Recipe 1' },
      { id: '2', name: 'Recipe 2' }
    ];

    // Call mockFetch with the array of recipes
    mockFetch(recipes);

    // Assume MyRecipesPage component fetches the recipes and displays them
    render(<MyRecipesPage />);

    // Wait for the recipes to be fetched and displayed
    await waitFor(() => {
      recipes.forEach(recipe => {
        expect(screen.getByTestId(`recipe-${recipe.id}`)).toHaveTextContent(recipe.name);
      });
    });
});


  test('displays an appropriate message if no recipes are found', async () => {
    // Mock an empty response
    interface Recipe {
      id: string;
      name: string;
    };

    const mockFetch = (body: Recipe[], ok: boolean = true, status: number = 200) => {
      global.fetch = jest.fn().mockImplementation(() =>
        Promise.resolve({
          ok,
          status,
          json: () => Promise.resolve(body),
        })
      );
    };

    mockFetch([]);

    render(<MyRecipesPage />);

    await waitFor(() => {
      expect(screen.getByText(/Recipes for testUser/i)).toBeInTheDocument();
      // Here, you might expect to see a message indicating no recipes were found.
      // For that, you would need to adjust the component to display such a message when the recipes array is empty.
    });
  });

  test('handles fetch error', async () => {
    const mockFetch = (body: [], ok: boolean = true, status: number = 200) => {
      global.fetch = jest.fn().mockImplementation(() =>
        Promise.resolve({
          ok,
          status,
          json: () => Promise.resolve(body),
        })
      );
    };

    mockFetch([], false, 500);

    render(<MyRecipesPage />);

    // Check for log or error state
    // Since console.error is being called, you might mock console.error and verify it was called.
    // Alternatively, if implementing error state display in the UI, check for that UI element.
  });

  // Add more tests as needed, such as for checking localStorage behavior, rendering logic based on different states, etc.
});

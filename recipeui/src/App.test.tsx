import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App, { Recipe } from './App';
import 'mutationobserver-shim';

global.MutationObserver = window.MutationObserver;

// Mock the fetch function
const mockFetch = jest.fn();

beforeAll(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockRecipes), // mockRecipes should be replaced with your test data
  });
});

afterEach(() => {
  jest.clearAllMocks();
  //localStorage.clear(); // Clear localStorage between tests
});

// Mock recipe data
const mockRecipes: Recipe[] = [
  {
    id: 1,
    title: 'Mock Recipe 1',
    shortDescription: 'Mock Short Description',
    description: 'Mock Description',
    imageUrl: 'mock-image-url',
    products: [{ id: 1, productName: 'Mock Product 1' }],
    preparation: 'Mock Preparation',
    skillLevel: 'Mock Skill Level',
    timeForCooking: 30,
    type: { id: 1, type: 'Mock Type' },
    recipeCreatorUserName: 'mock-user',
  },
];

describe('App', () => {
  it('renders header', () => {
    render(<App isLoggedIn={false} onLogout={jest.fn()} />);
    expect(screen.getByText('Recipes')).toBeInTheDocument();
  });

  it('renders loading state when fetching recipes', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockRecipes),
    });

    render(<App isLoggedIn={false} onLogout={jest.fn()} />);
    expect(screen.getByTestId('recipes-loading')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Mock Recipe 1')).toBeInTheDocument());
  });

  it('renders recipes', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockRecipes),
    });

    render(<App isLoggedIn={false} onLogout={jest.fn()} />);
    await waitFor(() => expect(screen.getByText('Mock Recipe 1')).toBeInTheDocument());
  });

  test('handleLogout functions', () => {
    const handleLoginSuccessMock = jest.fn();
    const handleLogoutMock = jest.fn();
    
    render(<App isLoggedIn={true} onLogout={handleLogoutMock} />);
    userEvent.click(screen.getByText('Logout'));
    expect(handleLogoutMock).toHaveBeenCalled();
  });

  // test('handleLoginSuccess functions', () => {
  //   // Mock functions for onLoginSuccess and onLogout
  //   const handleLoginSuccessMock = jest.fn();
  //   const handleLogoutMock = jest.fn();
    
  //   // Render App component with mock functions as props
  //   render(<App isLoggedIn={false} onLoginSuccess={handleLoginSuccessMock} onLogout={handleLogoutMock} />);
  
  //   userEvent.click(screen.getByText('Login'));
  //   expect(handleLoginSuccessMock).toHaveBeenCalled();
  // });
});

test('log in and create account buttons are displayed', () => {
  render(<App isLoggedIn={false} onLogout={jest.fn()} />);

  const loginButton = screen.getByTestId("login-button");
  const createRecipeButton = screen.getByTestId("create-recipe-button");

  expect(loginButton).toBeInTheDocument();
  expect(createRecipeButton).toBeInTheDocument();

  expect(loginButton.textContent).toBe('Login');
  expect(createRecipeButton.textContent).toBe('Create A Recipe');
});

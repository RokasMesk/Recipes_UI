import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App, { Recipe } from './App';
//import fetchMock from 'jest-fetch-mock';

const RegisterData = {
  "username": "laikinas",
  "email": "laikinas@gmail.com",
  "password": "password"
};


// test('check if loading is displayed when api off', () => {
//   render(<App />);

//   const recipeLoading = screen.getByTestId("recipes-loading")

//   expect(recipeLoading).toBeInTheDocument();
//   expect(recipeLoading.textContent).toBe('Loading...');
// });

test('log in and create account buttons are displayed', () => {
  render(<App />);

  const loginButton = screen.getByTestId("login-button");
  const createRecipeButton = screen.getByTestId("create-recipe-button");

  expect(loginButton).toBeInTheDocument();
  expect(createRecipeButton).toBeInTheDocument();

  expect(loginButton.textContent).toBe('Login');
  expect(createRecipeButton.textContent).toBe('Create A Recipe');
});

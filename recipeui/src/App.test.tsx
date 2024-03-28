import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App, { Recipe } from './App';
import Header from './Header';
import LoginModal from './LoginModal'
//import fetchMock from 'jest-fetch-mock';

const RegisterData = {
  "username": "laikinas",
  "email": "laikinas@gmail.com",
  "password": "password"
};


test('check if loading is displayed when api off', () => {
  render(<App />);

  const recipeLoading = screen.getByTestId("recipes-loading")

  expect(recipeLoading).toBeInTheDocument();
  expect(recipeLoading.textContent).toBe('Loading...');
});

test('log in and create account buttons are displayed', () => {
  render(<App />);

  const loginButton = screen.getByTestId("login-button");
  const createRecipeButton = screen.getByTestId("create-recipe-button");

  expect(loginButton).toBeInTheDocument();
  expect(createRecipeButton).toBeInTheDocument();

  expect(loginButton.textContent).toBe('Login');
  expect(createRecipeButton.textContent).toBe('Create A Recipe');
});

// test('try out inputs in login and register');
// test('register with falsy credentials');
// test('register');
// test('register and login');
// test('login with wrong credentials');
// test('login with correct credentials');

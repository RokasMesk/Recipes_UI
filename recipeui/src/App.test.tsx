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

// // Mocking fetch
// const mockRecipes: Recipe[] = [
//   {
//     id: 1,
//     title: 'Test Recipe',
//     shortDescription: 'Test Short Description',
//     description: 'Test Description',
//     imageUrl: 'test.jpg',
//     products: [{ id: 1, productName: 'Test Product' }],
//     preparation: 'Test Preparation',
//     skillLevel: 'Beginner',
//     timeForCooking: 30,
//     type: { id: 1, type: 'Test Type' },
//   },
// ];

// fetchMock.enableMocks();

// fetchMock.mockResponseOnce(JSON.stringify(mockRecipes));

// describe('App component', () => {
//   test('fetches data and renders recipes', async () => {
//     //render(<App />);

//     // Check if "Loading..." is displayed initially
//     //expect(screen.getByText('Loading...')).toBeInTheDocument();

//     // Wait for data to be loaded and check if recipe is rendered
//     //await waitFor(() => expect(screen.getByText('Test Recipe')).toBeInTheDocument());
//     expect(true);
//   });

//   test('logs in and logs out', () => {
//     render(<App />);

//     // Check if login button is rendered
//     expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();

//     // Login
//     userEvent.click(screen.getByRole('button', { name: 'Login' }));
//     expect(localStorage.getItem('isLoggedIn')).toBe('true');
    
//     // Check if logout button is rendered
//     expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();

//     // Logout
//     userEvent.click(screen.getByRole('button', { name: 'Logout' }));
//     expect(localStorage.getItem('isLoggedIn')).toBeNull();
//   });
// });

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

// test('log in and log out', () => {
//   render(<App />);

//   //Check if Login button is rendered
//   const loginButton = screen.getByTestId("login-button");
//   expect(loginButton).toBeInTheDocument();

//   //Login
//   userEvent.click(loginButton);

//   const loginUsernameEmailInput = screen.getByTestId("login-username-email");
//   const loginPasswordInput = screen.getByTestId("login-password");

//   expect(loginUsernameEmailInput).toBeInTheDocument();
//   expect(loginPasswordInput).toBeInTheDocument();

//   fireEvent.change(loginUsernameEmailInput, { target: { value: correctRegisterData.username } });
//   fireEvent.change(loginPasswordInput, { target: { value: correctRegisterData.password } });

//   //expect(localStorage.getItem('isLoggedIn')).toBe('true');
// });

// test('opens login modal and accesses its elements', () => {
//   // Mock onLogout and onLoginSuccess functions
//   const onLogout = jest.fn();
//   const onLoginSuccess = jest.fn();

//   // Render the Header component with isOpen set to true
//   render(
//     <LoginModal 
//       isOpen={true}
//       onClose={onLogout} 
//       onLoginSuccess={onLoginSuccess}
//       isRegistering={false} 
//     />
//   );

//   // Assert that the login modal is open
//   const loginModal = screen.getByTestId('login-modal-form');
//   expect(loginModal).toBeInTheDocument();

//   // Access elements within the login modal and assert their presence
//   const usernameInput = screen.getByTestId('login-username-email');
//   const passwordInput = screen.getByTestId('login-password');
//   // const loginButtonInModal = screen.getByText('Login'); // Assuming "Login" button text is present in the modal

//   expect(usernameInput).toBeInTheDocument();
//   expect(passwordInput).toBeInTheDocument();

//   fireEvent.change(usernameInput, { target: { value: RegisterData.username } });
//   fireEvent.change(passwordInput, { target: { value: RegisterData.password } });

//   // Assert input values
//   expect(usernameInput).toHaveValue(RegisterData.username);
//   expect(passwordInput).toHaveValue(RegisterData.password);
// });

// test('opens register modal and accesses its elements', () => {
//   // Mock onLogout and onLoginSuccess functions
//   const onLogout = jest.fn();
//   const onLoginSuccess = jest.fn();

//   // Render the Header component with isOpen set to true
//   render(
//     <LoginModal 
//       isOpen={true}
//       onClose={onLogout} 
//       onLoginSuccess={onLoginSuccess} 
//       isRegistering={true}
//     />
//   )

  // Assert that the login modal is open
  // const loginModal = screen.getByTestId('register-modal-form');
  // expect(loginModal).toBeInTheDocument();

  // // Access elements within the login modal and assert their presence
  // const usernameInput = screen.getByTestId('register-username');
  // const emailInput = screen.getByTestId('register-email');
  // const passwordInput = screen.getByTestId('login-password');
  // const passwordRepeatInput = screen.getByTestId('register-confirm-password');
  // // const loginButtonInModal = screen.getByText('Login'); // Assuming "Login" button text is present in the modal

//   // expect(usernameInput).toBeInTheDocument();
//   // expect(passwordInput).toBeInTheDocument();

//   fireEvent.change(usernameInput, { target: { value: RegisterData.username } });
//   fireEvent.change(emailInput, { target: { value: RegisterData.email } });
//   fireEvent.change(passwordInput, { target: { value: RegisterData.password } });
//   fireEvent.change(passwordRepeatInput, { target: { value: RegisterData.password } });

//   // Assert input values
//   expect(usernameInput).toHaveValue(RegisterData.username);
//   expect(emailInput).toHaveValue(RegisterData.email);
//   expect(passwordInput).toHaveValue(RegisterData.password);
//   expect(passwordRepeatInput).toHaveValue(RegisterData.password);
// });

// test('renders login modal in registration mode', () => {
//   render(
//     <LoginModal 
//       isOpen={true} 
//       onClose={() => {}} 
//       onLoginSuccess={() => {}} 
//       isRegistering={false}
//     />
//   );

//   // Check that the modal is rendered
//   const modal = screen.getByTestId('login-modal');
//   expect(modal).toBeInTheDocument();

//   // Check if the component is not in registration mode initially
//   const usernameInput = screen.queryByLabelText('Username:');
//   expect(usernameInput).not.toBeInTheDocument();

//   // Re-render the component with isRegistering set to true
//   render(
//     <LoginModal 
//       isOpen={true} 
//       onClose={() => {}} 
//       onLoginSuccess={() => {}} 
//       isRegistering={true} // Set isRegistering to true
//     />
//   );

//   // Check if the component is in registration mode
//   const registrationUsernameInput = screen.getByLabelText('Username:');
//   expect(registrationUsernameInput).toBeInTheDocument();
// });

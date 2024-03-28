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

test('opens login modal and checks if elements present', () => {
 // Mock onLogout and onLoginSuccess functions
 const onLogout = jest.fn();
 const onLoginSuccess = jest.fn();
 const toggleRegistering = jest.fn();

 // Render the Header component with isOpen set to true
 render(
   <LoginModal 
     isOpen={true}
     onClose={onLogout} 
     onLoginSuccess={onLoginSuccess}
     isRegistering={false} 
     toggleRegistering={toggleRegistering}
   />
 );

 // Assert that the login modal is open
 const loginModal = screen.getByTestId('login-modal-form');
 expect(loginModal).toBeInTheDocument();

 // Access elements within the login modal and assert their presence
 const usernameInput = screen.getByTestId('login-username-email');
 const passwordInput = screen.getByTestId('login-password');
 const loginButton = screen.getByTestId('login-register-button');
 const redirectRegisterLink = screen.getByTestId('if-not-registered-redirect');
 // const loginButtonInModal = screen.getByText('Login'); // Assuming "Login" button text is present in the modal

 expect(usernameInput).toBeInTheDocument();
 expect(passwordInput).toBeInTheDocument();
 expect(loginButton).toBeInTheDocument();
 expect(redirectRegisterLink).toBeInTheDocument();

 expect(loginButton.textContent).toBe('Login');
 expect(redirectRegisterLink.textContent).toBe('If you aren\'t already registered Click Here.');
});

test('opens login modal and tries input fields', () => {
 // Mock onLogout and onLoginSuccess functions
 const onLogout = jest.fn();
 const onLoginSuccess = jest.fn();
 const toggleRegistering = jest.fn();

 // Render the Header component with isOpen set to true
 render(
   <LoginModal 
     isOpen={true}
     onClose={onLogout} 
     onLoginSuccess={onLoginSuccess}
     isRegistering={false} 
     toggleRegistering={toggleRegistering}
   />
 );

  // Assert that the login modal is open
  const loginModal = screen.getByTestId('login-modal-form');
  expect(loginModal).toBeInTheDocument();

  // Access elements within the login modal and assert their presence
  const usernameInput = screen.getByTestId('login-username-email');
  const passwordInput = screen.getByTestId('login-password');
  // const loginButtonInModal = screen.getByText('Login'); // Assuming "Login" button text is present in the modal

  expect(usernameInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();

  fireEvent.change(usernameInput, { target: { value: RegisterData.username } });
  fireEvent.change(passwordInput, { target: { value: RegisterData.password } });

  // Assert input values
  expect(usernameInput).toHaveValue(RegisterData.username);
  expect(passwordInput).toHaveValue(RegisterData.password);
});

test('opens register modal and checks if elements present', () => {
 // Mock onLogout and onLoginSuccess functions
 const onLogout = jest.fn();
 const onLoginSuccess = jest.fn();
 const toggleRegistering = jest.fn();

 // Render the Header component with isOpen set to true
 render(
   <LoginModal 
     isOpen={true}
     onClose={onLogout} 
     onLoginSuccess={onLoginSuccess}
     isRegistering={false} 
     toggleRegistering={toggleRegistering}
   />
 );

  // Assert that the login modal is open
  const loginModal = screen.getByTestId('register-modal-form');
  expect(loginModal).toBeInTheDocument();

  // Access elements within the login modal and assert their presence
  const usernameInput = screen.getByTestId('register-username');
  const emailInput = screen.getByTestId('register-email');
  const passwordInput = screen.getByTestId('login-password');
  const passwordRepeatInput = screen.getByTestId('register-confirm-password');
  const registerButton = screen.getByTestId('login-register-button');
  const redirectLoginLink = screen.getByTestId('if-already-account-redirect');
  // const loginButtonInModal = screen.getByText('Login'); // Assuming "Login" button text is present in the modal

  expect(usernameInput).toBeInTheDocument();
  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(passwordRepeatInput).toBeInTheDocument();
  expect(registerButton).toBeInTheDocument();
  expect(redirectLoginLink).toBeInTheDocument();

  expect(registerButton.textContent).toBe('Register');
  expect(redirectLoginLink.textContent).toBe('If you already have an account Click Here.');
});

test('opens register modal and accesses its elements', () => {
 // Mock onLogout and onLoginSuccess functions
 const onLogout = jest.fn();
 const onLoginSuccess = jest.fn();
 const toggleRegistering = jest.fn();

 // Render the Header component with isOpen set to true
 render(
   <LoginModal 
     isOpen={true}
     onClose={onLogout} 
     onLoginSuccess={onLoginSuccess}
     isRegistering={false} 
     toggleRegistering={toggleRegistering}
   />
 );

  // Assert that the login modal is open
  const loginModal = screen.getByTestId('register-modal-form');
  expect(loginModal).toBeInTheDocument();

  // Access elements within the login modal and assert their presence
  const usernameInput = screen.getByTestId('register-username');
  const emailInput = screen.getByTestId('register-email');
  const passwordInput = screen.getByTestId('login-password');
  const passwordRepeatInput = screen.getByTestId('register-confirm-password');
  // const loginButtonInModal = screen.getByText('Login'); // Assuming "Login" button text is present in the modal

  expect(usernameInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();

  fireEvent.change(usernameInput, { target: { value: RegisterData.username } });
  fireEvent.change(emailInput, { target: { value: RegisterData.email } });
  fireEvent.change(passwordInput, { target: { value: RegisterData.password } });
  fireEvent.change(passwordRepeatInput, { target: { value: RegisterData.password } });

  // Assert input values
  expect(usernameInput).toHaveValue(RegisterData.username);
  expect(emailInput).toHaveValue(RegisterData.email);
  expect(passwordInput).toHaveValue(RegisterData.password);
  expect(passwordRepeatInput).toHaveValue(RegisterData.password);
});

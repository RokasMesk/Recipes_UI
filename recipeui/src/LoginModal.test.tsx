import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import LoginModal from './LoginModal'

const RegisterData = {
  "username": "laikinas",
  "email": "laikinas@gmail.com",
  "password": "password"
};

// test('opens login modal and checks if elements present', () => {
//  // Mock onLogout and onLoginSuccess functions
//  const onLogout = jest.fn();
//  const onLoginSuccess = jest.fn();
//  const toggleRegistering = jest.fn();

//  // Render the Header component with isOpen set to true
//  render(
//    <LoginModal 
//      isOpen={true}
//      onClose={onLogout} 
//      onLoginSuccess={onLoginSuccess}
//      isRegistering={false} 
//      toggleRegistering={toggleRegistering}
//    />
//  );

//  // Assert that the login modal is open
//  const loginModal = screen.getByTestId('login-modal-form');
//  expect(loginModal).toBeInTheDocument();

//  // Access elements within the login modal and assert their presence
//  const usernameInput = screen.getByTestId('login-username-email');
//  const passwordInput = screen.getByTestId('login-password');
//  const loginButton = screen.getByTestId('login-register-button');
//  const redirectRegisterLink = screen.getByTestId('if-not-registered-redirect');
//  // const loginButtonInModal = screen.getByText('Login'); // Assuming "Login" button text is present in the modal

//  expect(usernameInput).toBeInTheDocument();
//  expect(passwordInput).toBeInTheDocument();
//  expect(loginButton).toBeInTheDocument();
//  expect(redirectRegisterLink).toBeInTheDocument();

//  expect(loginButton.textContent).toBe('Login');
//  expect(redirectRegisterLink.textContent).toBe('If you aren\'t already registered Click Here.');
// });

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
     apiRequest={jest.fn()}
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
     isRegistering={true} 
     toggleRegistering={toggleRegistering}
     apiRequest={jest.fn()}
   />
 );

  // Assert that the login modal is open
  const registerModal = screen.getByTestId('register-modal-form');
  expect(registerModal).toBeInTheDocument();

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
     isRegistering={true} 
     toggleRegistering={toggleRegistering}
     apiRequest={jest.fn()}
   />
 );

  // Assert that the login modal is open
  const registerModal = screen.getByTestId('register-modal-form');
  expect(registerModal).toBeInTheDocument();

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

test('logins and logs out', () => {
    
});



describe('LoginModal (submit functionality)', () => {
  it('should call handleSubmit for login with correct data when submitted', async () => {
    const mockApiRequest = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ token: 'mockToken' })
    });
    const mockOnLoginSuccess = jest.fn();
    const mockToggleRegistering = jest.fn();

    const mockLoginResponse = { token: 'mockToken', username: 'mockUsername', email: 'mockEmail', roles: ['role1', 'role2'] };
    const { getByTestId } = render(
      <LoginModal
        isOpen={true}
        onClose={() => {}}
        onLoginSuccess={mockOnLoginSuccess}
        isRegistering={false}
        toggleRegistering={mockToggleRegistering}
        apiRequest={mockApiRequest}
      />
    );

    fireEvent.change(getByTestId('login-username-email'), { target: { value: RegisterData.username } });
    fireEvent.change(getByTestId('login-password'), { target: { value: RegisterData.password } });

    fireEvent.submit(getByTestId('login-modal-form'));

    await waitFor(() => {
      expect(mockApiRequest).toHaveBeenCalledWith('https://localhost:7063/api/User/login', {
        identifier: RegisterData.username,
        password: RegisterData.password
      });
    });
  });

  it('should call handleSubmit for registration with correct data when submitted', async () => {
    const mockOnLoginSuccess = jest.fn();
    const mockToggleRegistering = jest.fn();

    const mockApiRequest = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ token: 'mockToken' })
    });

    const { getByTestId } = render(
      <LoginModal
        isOpen={true}
        onClose={() => {}}
        onLoginSuccess={mockOnLoginSuccess}
        isRegistering={true}
        toggleRegistering={mockToggleRegistering}
        apiRequest={mockApiRequest}
      />
    );

    fireEvent.change(getByTestId('register-username'), { target: { value: RegisterData.username } });
    fireEvent.change(getByTestId('register-email'), { target: { value: RegisterData.email } });
    fireEvent.change(getByTestId('login-password'), { target: { value: RegisterData.password } });
    fireEvent.change(getByTestId('register-confirm-password'), { target: { value: RegisterData.password } });

    fireEvent.submit(getByTestId('register-modal-form'));

    await waitFor(() => {
      expect(mockApiRequest).toHaveBeenCalledWith('https://localhost:7063/api/User/register', {
        username: RegisterData.username,
        email: RegisterData.email,
        password: RegisterData.password
      });
    });
  });

  it('should handle password mismatch during registration', async () => {
    const mockOnLoginSuccess = jest.fn();
    const mockToggleRegistering = jest.fn();

    const mockApiRequest = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ token: 'mockToken' })
    });

    const { getByTestId } = render(
      <LoginModal
        isOpen={true}
        onClose={() => {}}
        onLoginSuccess={mockOnLoginSuccess}
        isRegistering={true}
        toggleRegistering={mockToggleRegistering}
        apiRequest={mockApiRequest}
      />
    );

    fireEvent.change(getByTestId('register-username'), { target: { value: 'testuser' } });
    fireEvent.change(getByTestId('register-email'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByTestId('login-password'), { target: { value: 'testpassword' } });
    fireEvent.change(getByTestId('register-confirm-password'), { target: { value: 'mismatchedpassword' } });

    fireEvent.submit(getByTestId('register-modal-form'));

    // Wait for any asynchronous operations to complete
    await waitFor(() => {
      // Assert that the API request is not called
      expect(mockApiRequest).not.toHaveBeenCalled();
  
      // Assert that an error message is displayed indicating the password mismatch
      //expect(queryByText('Passwords do not match.')).toBeInTheDocument();
  
      // Assert that the registration form is not reset after the submission attempt with a password mismatch
      expect(getByTestId('register-username')).toHaveValue('testuser');
      expect(getByTestId('register-email')).toHaveValue('test@example.com');
      expect(getByTestId('login-password')).toHaveValue('testpassword');
      expect(getByTestId('register-confirm-password')).toHaveValue('mismatchedpassword');
    });
  });

});

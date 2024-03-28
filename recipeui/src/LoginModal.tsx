import React, { useState } from 'react';
import './LoginModal.css';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string) => void;
  isRegistering: boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess, isRegistering }) => {
  //const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    identifier: '', // Change to identifier to accept either username or email
    username: '', // New field for registration
    email: '', // New field for registration
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const endpoint = isRegistering ? 'register' : 'login';

    if (isRegistering && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const requestData = isRegistering
      ? { username: formData.username, email: formData.email, password: formData.password }
      : { identifier: formData.identifier, password: formData.password };

    fetch(`https://localhost:7063/api/User/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to ${endpoint}`);
      }
      if (endpoint === 'register') {
        // Display registration success message
        setError('Registration successful, please log in');
        isRegistering=false; // Switch back to login mode
      } else {
        // Reset form fields and close modal for login
        
        setError('');
        onClose();
        return response.json();
      }
      setFormData({
        identifier: '', // Reset identifier field
        username: '', // Reset username field
        email: '', // Reset email field
        password: '',
        confirmPassword: ''
      });
    })
    .then(data => {
      if (endpoint === 'login') {
        const { token } = data;
        const { username, email, roles } = data;
        localStorage.setItem('username', username);
        localStorage.setItem('email', email);
        localStorage.setItem('roles', JSON.stringify(roles));
        // You can store loginResponse in state or wherever you need it
        console.log('Login successful:', data);
    
        onLoginSuccess(token);
      }
    })
    .catch(error => {
      console.error(`There was a problem ${endpoint} in:`, error);
      setError(`Failed to ${endpoint}. Please try again.`);
    });
  }

  const toggleRegistration = () => {
    //setIsRegistering(!isRegistering);
    isRegistering=true;
    setFormData({
      identifier: '', // Reset identifier field
      username: '', // Reset username field
      email: '', // Reset email field
      password: '',
      confirmPassword: ''
    });
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className={`modal ${isRegistering ? 'registering' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>X</button>
        <h1>{isRegistering ? 'Register' : 'Login'}</h1>
        {error && <p className="error">{error}</p>}
        <form data-testid={isRegistering ? 'register-modal-form' : 'login-modal-form'} onSubmit={handleSubmit}>
          {isRegistering && (
            <div className="form-group">
              <label>Username:</label>
              <input type="text" name="username" data-testid="register-username" value={formData.username} onChange={handleInputChange} required />
            </div>
          )}
          {isRegistering && (
            <div className="form-group">
              <label>Email:</label>
              <input type="email" name="email" data-testid="register-email" value={formData.email} onChange={handleInputChange} required />
            </div>
          )}
          {!isRegistering && (
            <div className="form-group">
              <label>Username or Email:</label>
              <input type="text" name="identifier" data-testid="login-username-email" value={formData.identifier} onChange={handleInputChange} required />
            </div>
          )}
          <div className="form-group">
            <label>Password:</label>
            <input type="password" name="password" data-testid="login-password" value={formData.password} onChange={handleInputChange} required />
          </div>
          {isRegistering && (
            <div className="form-group">
              <label>Confirm Password:</label>
              <input type="password" name="confirmPassword" data-testid="register-confirm-password" value={formData.confirmPassword} onChange={handleInputChange} required />
            </div>
          )}
          <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
        </form>
        {!isRegistering ? (
          <p>If you aren't already registered <span className="clickable-text" onClick={toggleRegistration}>Click Here</span>.</p>
        ) : (
          <p>If you are already have an account <span className="clickable-text" onClick={toggleRegistration}>Click Here</span>.</p>
        )}
      </div>
    </div>
  );
};

export default LoginModal;

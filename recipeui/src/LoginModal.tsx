import React, { useState } from 'react';
import './LoginModal.css';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string) => void;
  isRegistering: boolean;
  toggleRegistering: () => void;
  apiRequest: (url: string, data: object) => Promise<Response>; // Add apiRequest prop
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess, isRegistering, toggleRegistering, apiRequest }) => {
  const [formData, setFormData] = useState({
    identifier: '', 
    username: '',
    email: '',
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

    apiRequest(`https://localhost:7063/api/User/${endpoint}`, requestData)
      .then((response: Response) => { // Specify type of response
        if (!response.ok) {
          throw new Error(`Failed to ${endpoint}`);
        }
        if (endpoint === 'register') {
          setError('Registration successful, please log in');
        } else {
          setError('');
          onClose();
          return response.json();
        }
        setFormData({
          identifier: '',
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
      })
      .then(data => {
        if (endpoint === 'login') {
          const { token, username, email, roles, userId } = data; 
          localStorage.setItem('username', username);
          localStorage.setItem('email', email);
          localStorage.setItem('roles', JSON.stringify(roles));
          localStorage.setItem('userId', userId); // Store the userId
          console.log('Login successful:', data);
          onLoginSuccess(token);
        }
      })
      .catch(error => {
        console.error(`There was a problem ${endpoint} in:`, error);
        setError(`Failed to ${endpoint}. Please try again.`);
      });
  }

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
          <button data-testid="login-register-button" type="submit">{isRegistering ? 'Register' : 'Login'}</button>
        </form>
        {!isRegistering ? (
          <p data-testid="if-not-registered-redirect">If you aren&apos;t already registered <span className="clickable-text" onClick={toggleRegistering}>Click Here</span>.</p>
        ) : (
          <p data-testid="if-already-account-redirect">If you already have an account <span className="clickable-text" onClick={toggleRegistering}>Click Here</span>.</p>
        )}
      </div>
    </div>
  );
};

export default LoginModal;

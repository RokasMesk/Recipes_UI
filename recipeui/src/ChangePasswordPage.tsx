import React, { useState } from 'react';
import './App.css';

const ChangePasswordPage: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirm password do not match');
      return;
    }

    try {
      const response = await fetch('https://localhost:7063/api/User/change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: localStorage.getItem('email'),
          oldPassword: currentPassword,
          newPassword: newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to change password');
      }

      // Password changed successfully
      alert('Password changed successfully');
      // Redirect user to another page if needed
    } catch (error: any) {
      console.error('Error changing password:', error);
      if (error instanceof Error) {
        setErrorMessage(error.message || 'Failed to change password');
      } else {
        setErrorMessage('Failed to change password');
      }
    }
  };

  return (
    <div>
      <h2>Change Password</h2>
      {errorMessage && <div className="error">{errorMessage}</div>}
      <form onSubmit={handleChangePassword}>
        <div>
          <label htmlFor="current-password">Current Password:</label>
          <input type="password" id="current-password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="new-password">New Password:</label>
          <input type="password" id="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="confirm-password">Confirm New Password:</label>
          <input type="password" id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePasswordPage;

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChangePasswordPage from './ChangePasswordPage';
import 'mutationobserver-shim';

global.MutationObserver = window.MutationObserver;

afterEach(() => {
    jest.restoreAllMocks();
  });

describe('ChangePasswordPage', () => {
    test('renders correctly', () => {
      render(<ChangePasswordPage />);
      expect(screen.getByTestId('change-password')).toBeInTheDocument();
      expect(screen.getByLabelText('Current Password:')).toBeInTheDocument();
      expect(screen.getByLabelText('New Password:')).toBeInTheDocument();
      expect(screen.getByLabelText('Confirm New Password:')).toBeInTheDocument();
    });
  
    test('updates state on input change', () => {
        render(<ChangePasswordPage />);
        const currentPasswordInput = screen.getByLabelText('Current Password:') as HTMLInputElement;
        fireEvent.change(currentPasswordInput, { target: { value: 'oldPassword' } });
        expect(currentPasswordInput.value).toBe('oldPassword');
      
        const newPasswordInput = screen.getByLabelText('New Password:') as HTMLInputElement;
        fireEvent.change(newPasswordInput, { target: { value: 'newPassword' } });
        expect(newPasswordInput.value).toBe('newPassword');
      
        const confirmPasswordInput = screen.getByLabelText('Confirm New Password:') as HTMLInputElement;
        fireEvent.change(confirmPasswordInput, { target: { value: 'newPassword' } });
        expect(confirmPasswordInput.value).toBe('newPassword');
      });
      
  
  test('displays error when new passwords do not match', async () => {
    render(<ChangePasswordPage />);
    fireEvent.change(screen.getByLabelText('New Password:'), { target: { value: 'password1' } });
    fireEvent.change(screen.getByLabelText('Confirm New Password:'), { target: { value: 'password2' } });
    
    fireEvent.click(screen.getByTestId("change-password"));
    
    await waitFor(() => {
      const errorMessage = screen.getByText('New password and confirm password do not match');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test('successful password change', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
      })
    ) as jest.Mock;
  
    render(<ChangePasswordPage />);
    // Fill the form and submit
    fireEvent.change(screen.getByLabelText('Current Password:'), { target: { value: 'oldPass' } });
    fireEvent.change(screen.getByLabelText('New Password:'), { target: { value: 'newPass' } });
    fireEvent.change(screen.getByLabelText('Confirm New Password:'), { target: { value: 'newPass' } });
  
    fireEvent.click(screen.getByTestId("change-password"));
  
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    // Here you might also want to check if a success message is displayed
    // or if the user is redirected/their state is updated as expected
  });

  test('displays error on password change failure', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false, // Indicate a failed fetch call
        json: () => Promise.resolve({ message: 'Failed to change password' }),
      })
    ) as jest.Mock;
  
    render(<ChangePasswordPage />);
    // Fill in the form and submit
    fireEvent.change(screen.getByLabelText('Current Password:'), { target: { value: 'currentPassword' } });
    fireEvent.change(screen.getByLabelText('New Password:'), { target: { value: 'newPassword123' } });
    fireEvent.change(screen.getByLabelText('Confirm New Password:'), { target: { value: 'newPassword123' } });
  
    fireEvent.click(screen.getByTestId("change-password"));
  
    await waitFor(() => {
      const errorMessage = screen.getByText((content, node) => { // Provide custom text matcher function
        if (!node) return false; // Handle null node
        
        const hasText = (element: Element) => element.textContent === "Failed to change password";
        const nodeHasText = hasText(node);
        const childrenDontHaveText = Array.from(node.children).every(
          (child: Element) => !hasText(child)
        );
  
        return nodeHasText && childrenDontHaveText;
      });
  
      expect(errorMessage).toBeInTheDocument();
    });
  });
  
});
  
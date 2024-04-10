import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';

describe('Header Component', () => {
    // Helper function to render the component with all required props
    const renderHeader = (isLoggedIn = false) => {
        const mockOnLogout = jest.fn();
        const mockOnLoginSuccess = jest.fn();
        render(
            <BrowserRouter>
                <Header isLoggedIn={isLoggedIn} onLogout={mockOnLogout} onLoginSuccess={mockOnLoginSuccess} />
            </BrowserRouter>
        );
        return { mockOnLogout, mockOnLoginSuccess };
    }

    it('should display login button when not logged in', () => {
        renderHeader();
        expect(screen.getByTestId('login-button')).toBeInTheDocument();
    });
    it('opens the login modal', async () => {
        renderHeader();
        const loginButton = screen.getByTestId('login-button');
        fireEvent.click(loginButton);

        const fields = ['login-username-email', 'login-password', 'login-register-button'];

        fields.forEach(el => {
            expect(screen.getByTestId(el)).toBeVisible
        });

        it('should display user information and logout button when logged in', () => {
            Storage.prototype.getItem = jest.fn(() => 'true'); // Mock localStorage for isLoggedIn
            renderHeader(true);
            expect(screen.getByText(/logout/i)).toBeInTheDocument();
            expect(screen.getByText(/hello,/i)).toBeInTheDocument(); // Assuming username is set correctly in localStorage
        });

        it('opens the recipe creation modal', async () => {
            renderHeader();
            const createRecipeButton = screen.getByTestId('create-recipe-button');
            fireEvent.click(createRecipeButton);

            const fields = ['title', 'time-for-cooking', 'description', 'short-description'];

            fields.forEach(el => {
                expect(screen.getByTestId(el)).toBeVisible
            });
        });


    })

    it('logs out correctly', () => {
        const { mockOnLogout } = renderHeader(true);
        const logoutButton = screen.getByText(/logout/i);
        fireEvent.click(logoutButton);
        expect(mockOnLogout).toHaveBeenCalled();
    });
});

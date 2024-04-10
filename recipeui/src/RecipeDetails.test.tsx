// RecipeDetails.test.tsx
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RecipeDetails from './RecipeDetails';
import { useParams, useNavigate, NavigateFunction, BrowserRouter } from 'react-router-dom';
import 'mutationobserver-shim';
import userEvent from '@testing-library/user-event';

global.MutationObserver = window.MutationObserver;

// Type for the recipe data
interface Recipe {
    id: string;
    recipeCreatorUserName: string;
    title: string;
    imageUrl: string;
    shortDescription: string;
    description: string;
    preparation: string;
    skillLevel: string;
    timeForCooking: number;
    type: number;
}

// Mock react-router-dom hooks with TypeScript
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // Use actual for all non-mocked parts
    useParams: jest.fn(),
    useNavigate: jest.fn() as jest.MockedFunction<() => NavigateFunction>, // Correctly type the mock
}));

// Helper function to setup localStorage data for tests, with proper typing
const setLocalStorageData = (data: Record<string, unknown>): void => {
    Object.keys(data).forEach(key => {
        localStorage.setItem(key, JSON.stringify(data[key]));
    });
};

// Mock API responses with proper typing for the body parameter
const mockFetch = (body: Recipe | { message: string }, ok: boolean = true, status: number = 200): void => {
    global.fetch = jest.fn().mockImplementation(() =>
        Promise.resolve({
            ok,
            status,
            json: () => Promise.resolve(body),
        })
    );
};

describe('RecipeDetails', () => {
    const mockNavigate = jest.fn();
    const recipeData = {
        id: '1',
        recipeCreatorUserName: 'Test User',
        imageUrl: 'testing.com',
        title: 'Test Recipe',
        products: [ // Ensure this array exists to prevent the error
            { id: 'product1', productName: 'Test Product 1' },
            { id: 'product2', productName: 'Test Product 2' }
        ],
        shortDescription: 'Test Short Description',
        description: 'Test Description',
        preparation: 'Test Preparation',
        skillLevel: 'Test skill level',
        timeForCooking: 123,
        type: 1
    };
    beforeEach(() => {
        localStorage.setItem('roles', JSON.stringify(['Admin']));
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
        (useParams as jest.Mock).mockReturnValue({ id: '1' });
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(recipeData),
          });
    });

    afterEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    test('renders recipe details after fetching data', async () => {
        (useParams as jest.Mock).mockReturnValue({ id: '1' });
        mockFetch(recipeData);

        render(<RecipeDetails />);
        await waitFor(() => expect(screen.getByText('Recipe author: Test User')).toBeInTheDocument());

        expect(screen.getByText('Test Short Description')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByText('Test Product 2')).toBeInTheDocument();
        expect(screen.getByText('Test Preparation')).toBeInTheDocument();
        expect(screen.getByText('Test skill level')).toBeInTheDocument();
    });

    test('conditionally renders edit and delete buttons based on user role', async () => {
        setLocalStorageData({
            roles: ['Admin'],
            username: 'Test User',
        });

        mockFetch(recipeData);

        render(<RecipeDetails />);
        await waitFor(() => {
            expect(screen.getByText('Edit')).toBeInTheDocument();
            expect(screen.getByText('Delete')).toBeInTheDocument();
        });
    });

    test('handles fetch error gracefully', async () => {
        mockFetch({ message: 'Error fetching recipe' }, false, 404);

        render(<RecipeDetails />);
        await waitFor(() => expect(screen.getByText('Loading...')).toBeInTheDocument());
        // Implement your error handling UI assertion here
    });
    test('handles successful recipe deletion', async () => {
        // Override fetch mock specifically for this test to simulate the deletion
        // This is placed after the initial render to ensure recipe details are fetched first
        const deleteMock = jest.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve({}), // Mock response for deletion, doesn't need details
        });
    
        render(<RecipeDetails />);
        await waitFor(() => expect(screen.getByText('Test Product 1')).toBeInTheDocument());

        global.fetch = deleteMock;
    
        const deleteButton = screen.getByText('Delete');
        userEvent.click(deleteButton);
    
        // Assertions for deletion
        await waitFor(() => expect(deleteMock).toHaveBeenCalled());
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });

    test('navigates to edit page on edit button click', async () => {
        setLocalStorageData({
            roles: ['Admin'],
            username: 'Test User',
        });
        mockFetch(recipeData);

        render(<RecipeDetails />);
        await waitFor(() => screen.getByText('Edit').click());

        expect(mockNavigate).toHaveBeenCalledWith(`/edit/${recipeData.id}`);
    });

    // ^^ works

    test('handles error on recipe deletion failure', async () => {
        // Setup the initial successful fetch for recipe details
        global.fetch = jest.fn().mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(recipeData), // Use recipeData that includes 'products' array
        });
      
        render(<RecipeDetails />);
      
        // Wait for an element that only appears after the recipe details have loaded
        // This ensures the component has transitioned from the loading state
        await waitFor(() => expect(screen.getByText('Test Product 1')).toBeInTheDocument());
      
        // Now, override the fetch mock to simulate a deletion failure
        // This mock is set up after confirming the component has loaded the initial data
        global.fetch = jest.fn().mockResolvedValueOnce({
          ok: false,
          json: () => Promise.resolve({ message: "Error message from server" }),
        });
      
        // Attempt to interact with the "Delete" button
        const deleteButton = screen.getByText('Delete');
        userEvent.click(deleteButton);
      
        // Assertions to verify the error handling logic
        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1)); // Considering the initial fetch for details and the deletion attempt
        // Place any additional assertions here, such as checking for console.error calls or UI feedback on error
      });

    // Add more tests as needed for delete functionality, error handling, etc.
});

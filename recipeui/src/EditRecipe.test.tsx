// EditRecipe.test.tsx
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import EditRecipe from './EditRecipe'; // Adjust the import path as needed
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import 'mutationobserver-shim';
import userEvent from '@testing-library/user-event';

global.MutationObserver = window.MutationObserver;

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // Preserve other exports from react-router-dom
    useParams: jest.fn().mockReturnValue({ id: '1' }), // Mock useParams to return a fixed id
    useNavigate: () => mockNavigate, // Mock useNavigate to use our mock function
}));

global.fetch = jest.fn(); // Type assertion for TypeScript, if you're using it

beforeEach(() => {
    jest.clearAllMocks(); // Clears any previous operations between tests

    (global.fetch as jest.Mock).mockImplementation((url: string) =>
        Promise.resolve({
            ok: true,
            json: () => {
                if (url.includes('/api/Recipe/')) {
                    return Promise.resolve({
                        title: 'Test Recipe',
                        description: 'Test Description',
                        shortDescription: 'Test Short Description',
                        preparation: 'Test Preparation',
                        skillLevel: 'Beginner',
                        timeForCooking: '30',
                        products: [{ id: 1 }, { id: 2 }],
                        type: '1',
                        imageUrl: 'http://example.com/image.jpg',
                    });
                } else if (url.includes('/api/Product')) {
                    return Promise.resolve([
                        { id: 1, productName: 'Product 1' },
                        { id: 2, productName: 'Product 2' },
                    ]);
                } else if (url.includes('/api/RecipeType')) {
                    return Promise.resolve([
                        { id: 1, typeName: 'Type 1' },
                        { id: 2, typeName: 'Type 2' },
                    ]);
                }
                return Promise.reject(new Error('Unknown URL'));
            },
        })
    );
});

describe('EditRecipe Component', () => {
    it('renders loading state initially', () => {
        render(
            <MemoryRouter>
                <EditRecipe />
            </MemoryRouter>
        );
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('loads and displays recipe data', async () => {
        render(
            <MemoryRouter>
                <EditRecipe />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Recipe')).toBeInTheDocument();
        });
    });

    it('updates the title input value', async () => {
        render(
            <MemoryRouter>
                <EditRecipe />
            </MemoryRouter>
        );

        const titleInput = await screen.findByTestId('edit-title') as HTMLInputElement;
        fireEvent.change(titleInput, { target: { value: 'New Recipe Title' } });
        expect(titleInput.value).toBe('New Recipe Title');
        
        const submitButton = screen.getByTestId('edit-submit');
        userEvent.click(submitButton);
        
        await waitFor(() => {
            expect(window.location.href).toContain('//localhost/');
          });
    });
});

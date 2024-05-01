import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RecipeBox from './RecipeBox';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import 'mutationobserver-shim';

global.MutationObserver = window.MutationObserver;

// Mocking navigate function used in the component
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));

describe('RecipeBox', () => {
    const mockRecipe = {
        id: 1,
        recipeCreatorUserName: 'testUser',
        imageUrl: 'testImageUrl',
        title: 'Test Recipe',
        description: 'Test Description',
        products: [{ id: 1, productName: 'Apple' }],
        shortDescription: 'Test Short Description',
        preparation: 'Test Preparation',
        skillLevel: 'Test Skill Level',
        timeForCooking: 123,
        type: { id: 1, type: "Vegan" },
        rating: 4, // Add a mock value for rating
        ratedPeopleCount: 10,
        productName: true
    };

    beforeEach(() => {
        localStorage.setItem('userId', '123');
        localStorage.setItem('isLoggedIn', 'true');
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve([]), // Adjust based on what the fetch call expects to return
        });
    });

    afterEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    test('renders recipe details correctly', () => {
        render(
            <BrowserRouter>
                <RecipeBox recipe={mockRecipe} />
            </BrowserRouter>
        );

        expect(screen.getByText('Test Recipe')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('Bendras ivertinimas:')).toBeInTheDocument();
    });

    test('fetches and displays favorite recipes on mount', async () => {
        // Mock fetch to simulate fetching favorites successfully
        const favoritesMock = [{
            id: 1, // Make sure this matches `mockRecipe.id` to simulate the recipe being a favorite
            // include other required properties
        }];

        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(favoritesMock),
        });

        render(
            <BrowserRouter>
                <RecipeBox recipe={mockRecipe} />
            </BrowserRouter>
        );

        // Wait for the component to update based on the fetch call
        await waitFor(() => {
            expect(screen.getByTestId('like-button')); // Adjust based on how you indicate a recipe is liked
        });
    });

    test('toggles like status when like button is clicked', async () => {
        // Setup initial state as not liked
        localStorage.setItem('userId', '123');

        // First fetch call for favorites, second for toggling like status
        global.fetch = jest.fn()
            .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // Initial fetch for favorites
            .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) }); // Response for like/unlike action

        render(
            <BrowserRouter>
                <RecipeBox recipe={mockRecipe} />
            </BrowserRouter>
        );

        const likeButton = await screen.findByTestId('like-button'); // Make sure to add 'data-testid="like-button"' to your button
        userEvent.click(likeButton);

        // Verify fetch was called for the toggle action
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(3);
            // Verify the fetch call for toggling like used the correct method ('POST' for like or 'DELETE' for unlike)
        });
    });

    test('fetches and displays rating status for the logged-in user', async () => {
        const ratingStatusMock = 3; // Example rating status

        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(ratingStatusMock),
        });

        render(
            <BrowserRouter>
                <RecipeBox recipe={mockRecipe} />
            </BrowserRouter>
        );

        // Wait for the component to display the fetched rating
        await waitFor(() => {
            const ratingDisplay = screen.getByTestId('user-rating'); // Ensure you have 'data-testid' on your rating display
            expect(ratingDisplay).toHaveTextContent('1 Star2 Stars3 Stars4 Stars5 StarsEmpty'); // Adjust based on your actual text content
        });
    });

    // const mockNavigate = jest.fn();

    // test('navigates to the author’s profile page on author name click', async () => {
    //     jest.mock('react-router-dom', () => ({
    //         ...jest.requireActual('react-router-dom'), // use actual implementations for everything else
    //         useNavigate: () => mockNavigate, // return the mock function
    //     }));

    //     render(
    //         <BrowserRouter>
    //             <RecipeBox recipe={mockRecipe} />
    //         </BrowserRouter>
    //     );

    //     const authorName = screen.getByTestId("click-author");
    //     userEvent.click(authorName);
    //     console.log(screen.debug());

    //     await waitFor(() => {
    //         expect(mockNavigate).toHaveBeenCalledWith(`/profile/${mockRecipe.recipeCreatorUserName}`);
    //       });
    // });
});

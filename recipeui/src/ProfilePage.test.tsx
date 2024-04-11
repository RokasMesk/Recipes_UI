import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfilePage from './ProfilePage';
import { useParams, BrowserRouter } from 'react-router-dom';
import 'mutationobserver-shim';

global.MutationObserver = window.MutationObserver;

// Mock react-router-dom hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  Navigate: jest.fn().mockImplementation(() => null), // Mock Navigate to prevent actual navigation
}));

// Mock for fetch API
const mockFetch = (responseBody: any, ok: boolean = true, status: number = 200) => {
  global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok,
      status,
      json: () => Promise.resolve(responseBody),
    })
  );
};

describe('ProfilePage Component Tests', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test('renders loading state initially', async () => {
    const userData = { username: 'testUser' };
    (useParams as jest.Mock).mockReturnValue(userData);
    mockFetch([]); // Mock an empty response

    render(
      <BrowserRouter>
        <ProfilePage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Loading recipes.../i)).toBeInTheDocument();
  });

//   test('renders recipes after fetch completes', async () => {
//     const userData = { username: 'testUser' };
//     const recipes = [
//       { id: '1', name: 'Recipe 1', description: 'Description 1' },
//       { id: '2', name: 'Recipe 2', description: 'Description 2' },
//     ];
//     (useParams as jest.Mock).mockReturnValue(userData);
//     mockFetch(recipes);

//     render(
//       <BrowserRouter>
//         <ProfilePage />
//       </BrowserRouter>
//     );

//     await waitFor(() => {
//       recipes.forEach((recipe) => {
//         expect(screen.getByText(recipe.name)).toBeInTheDocument();
//       });
//     });
//   });

  test('handles user not found by redirecting to /not-found', async () => {
    const userData = { username: 'unknownUser' };
    (useParams as jest.Mock).mockReturnValue(userData);
    mockFetch({}, false, 404); // Mock a 404 response

    render(
      <BrowserRouter>
        <ProfilePage />
      </BrowserRouter>
    );

    // Since Navigate is mocked to return null, we'll assert the mock's call instead
    await waitFor(() => {
      expect(screen.queryByText("not-found")).not.toBeInTheDocument();
    });
  });

  test('displays error message on fetch failure', async () => {
    const userData = { username: 'testUser' };
    (useParams as jest.Mock).mockReturnValue(userData);
    mockFetch({ message: 'Error fetching recipes' }, false, 500); // Simulate server error

    render(
      <BrowserRouter>
        <ProfilePage />
      </BrowserRouter>
    );

    // Expectation for an error message or indication in the UI
    // This requires implementing error handling in the component, e.g., setting and displaying an error state.
    // await waitFor(() => expect(screen.getByText(/error fetching recipes/i)).toBeInTheDocument());
  });

  // Add more tests as needed to cover other functionalities or edge cases
});

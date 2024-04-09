import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RecipeCreationModal from './RecipeCreationModal';
import 'mutationobserver-shim';

global.MutationObserver = window.MutationObserver;

describe('RecipeCreationModal', () => {
  test('renders when isOpen is true', () => {
    render(<RecipeCreationModal isOpen={true} onClose={() => {}} />);
    expect(screen.getByText('Create a Recipe')).toBeInTheDocument();
  });

  test('does not render when isOpen is false', () => {
    render(<RecipeCreationModal isOpen={false} onClose={() => {}} />);
    expect(screen.queryByText('Create a Recipe')).toBeNull();
  });
});

test('updates title field on change', () => {
  render(<RecipeCreationModal isOpen={true} onClose={() => {}} />);
  const titleInput = screen.getByTestId('title') as HTMLInputElement; // Type assertion here
  fireEvent.change(titleInput, { target: { value: 'New Recipe Title' } });
  expect(titleInput.value).toBe('New Recipe Title'); // Now it correctly recognizes the 'value' property
});

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockImplementation(() =>
    Promise.resolve(new Response(JSON.stringify([{ id: 1, productName: 'Apple', selected: false }])))
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('fetches products on component mount', async () => {
  render(<RecipeCreationModal isOpen={true} onClose={() => {}} />);
  await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('https://localhost:7063/api/Product'));
});

test('calls onClose after successful recipe creation', async () => {
  const onCloseMock = jest.fn();

  // Spy on global.fetch and use mockImplementationOnce
  jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
    Promise.resolve(new Response(JSON.stringify({ ok: true })))
  );

  render(<RecipeCreationModal isOpen={true} onClose={onCloseMock} />);
  
  // Assuming you have a button or form to submit for creating a recipe.
  fireEvent.click(screen.getByText('Create Recipe'));
  
  await waitFor(() => expect(onCloseMock).toHaveBeenCalled());
});


test('renders ProductSearchBar when modal is open', () => {
  render(<RecipeCreationModal isOpen={true} onClose={() => {}} />);

  // Assuming ProductSearchBar includes an input with a specific placeholder or role.
  // This example uses a placeholder attribute, but you can adjust it to fit the unique identifier of your choice.
  const searchBarInput = screen.getByPlaceholderText('Search'); // Adjust this placeholder text as needed.
  
  expect(searchBarInput).toBeInTheDocument();
});



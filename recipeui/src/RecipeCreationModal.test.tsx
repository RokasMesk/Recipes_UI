import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RecipeCreationModal from './RecipeCreationModal';
import 'mutationobserver-shim';

global.MutationObserver = window.MutationObserver;

// Mocking fetch for testing purposes
const mockFetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
);

const formFields = [
  'title',
  'short-description',
  'description',
  'image-url',
  'preparation',
  'skill-level',
  'time-for-cooking',
  'type'
];

global.fetch = mockFetch as jest.Mock;

describe('RecipeCreationModal', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<RecipeCreationModal isOpen={true} onClose={() => {}} />);
  });

  it('renders the form fields', () => {
    render(<RecipeCreationModal isOpen={true} onClose={() => {}} />);
    
    formFields.forEach(el => {
      const element = screen.getByTestId(el)
      expect(element).toBeInTheDocument();
    });
  });

  it('submits the form with correct data', async () => {
    const onCloseMock = jest.fn();
    const { getByLabelText, getByText } = render(<RecipeCreationModal isOpen={true} onClose={onCloseMock} />);

    // Fill out form fields
    fireEvent.change(screen.getByTestId("title"), { target: { value: 'Test Recipe' } });
    fireEvent.change(screen.getByTestId("short-description"), { target: { value: 'Short Description Test' } });
    // Add similar fireEvent calls for other form fields

    formFields.forEach(el => {
      const element = screen.getByTestId(el)
      expect(element).toBeInTheDocument();
      if (el == 'time-for-cooking' || el == 'type')
        fireEvent.change(element, { target: { value: 1 } } ) 
      else
        fireEvent.change(element, { target: { value: 'test ' + el } } )
    });

    // Submit the form
    fireEvent.click(getByText('Create Recipe'));

    // Wait for fetch call to be made
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(mockFetch).toHaveBeenCalledWith('https://localhost:7063/api/Recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'test title',
          shortDescription: 'test short-description',
          description: 'test description',
          imageUrl: 'test image-url',
          products: [],
          preparation: 'test preparation',
          skillLevel: 'test skill-level',
          timeForCooking: '1',
          type: '1',
          author: null
        }),
      });
    });

    // Ensure onClose function is called after successful form submission
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductSearchBar from './ProductSearchBar';
import 'mutationobserver-shim';

global.MutationObserver = window.MutationObserver;

beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve(
        new Response(JSON.stringify([{ id: 1, productName: 'Apple', selected: false }]))
      )
    );
  });
  
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });
  
  test('fetches products on component mount', async () => {
    render(<ProductSearchBar setResults={() => {}} setSelectedProducts={() => {}} />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    expect(global.fetch).toHaveBeenCalledWith('https://localhost:7063/api/Product');
  });

  test('filters products based on search input', async () => {
    const setResultsMock = jest.fn();
    render(<ProductSearchBar setResults={setResultsMock} setSelectedProducts={() => {}} />);
    await waitFor(() => expect(setResultsMock).toHaveBeenCalled());
  
    setResultsMock.mockClear();
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'App' } });
  
    await waitFor(() => expect(setResultsMock).toHaveBeenCalledTimes(1));
    expect(setResultsMock).toHaveBeenCalledWith(expect.any(Array));
  });
  
  
  test('fetches products and calls setResults on input change', async () => {
    const setResultsMock = jest.fn();
    const setSelectedProductsMock = jest.fn();
  
    const mockFetch = jest.spyOn(global, 'fetch') as jest.Mock;
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve(
        new Response(JSON.stringify([
          { id: 1, productName: 'Apple', selected: false },
          { id: 2, productName: 'Banana', selected: false }
        ]))
      )
    );
  
    render(<ProductSearchBar setResults={setResultsMock} setSelectedProducts={setSelectedProductsMock} />);
  
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'App' } });
    await waitFor(() => expect(setResultsMock).toHaveBeenCalledWith(expect.any(Array)));
  });
  
  
  
  
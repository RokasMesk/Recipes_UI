import React from 'react';

interface SearchResultsListProps {
  results: any[];
}

const SearchResultsList: React.FC<SearchResultsListProps> = ({ results }) => {
  return (
    <div className='results-list'>
      {
        results.map((result, id) => {
          return <div className="search-result"key={id}> {result.title} </div>; 
        })
      }
    </div>
  );
}

export default SearchResultsList;
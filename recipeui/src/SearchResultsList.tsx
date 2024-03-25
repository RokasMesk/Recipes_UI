import { title } from 'process';
import React from 'react';
import { Link } from 'react-router-dom';
interface SearchResultsListProps {
  results: any[];
}

const SearchResultsList: React.FC<SearchResultsListProps> = ({ results }) => {
  
  return (
    <div className='results-list'>
      {
        results.map((result, id) => {
          return <><div className="search-result"key={id}> {result.title} </div> 
          <Link to={`/recipe/${result.id}`} className="see-more-button">
          Read more

          </Link>
          </>
        })
      }
    </div>
  );
}

export default SearchResultsList;
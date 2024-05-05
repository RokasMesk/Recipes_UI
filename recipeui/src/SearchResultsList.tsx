import React from 'react';
import { Link } from 'react-router-dom';
interface SearchResultsListProps {
  results: Recipe[];
}
export interface Recipe {
  title: string;
  id: number;
 
}
const SearchResultsList: React.FC<SearchResultsListProps> = ({ results }) => {
  
  return (
    <div className='results-list'>
      {
        results.map((result, id) => {
          return <><div className="search-result"key={id}> {result.title} </div> 
          <Link to={`/recipe/${result.id}`} className="see-more-button-search">
          Plačiau apie receptą

          </Link>
          </>
        })
      }
    </div>
  );
}

export default SearchResultsList;
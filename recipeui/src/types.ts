// types.ts
export interface LoginResponseDTO {
    username: string;
    email: string;
    roles: string[];
    token: string;
  }
  
//   import React, {Dispatch, SetStateAction, useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
// import { faSearch } from '@fortawesome/free-solid-svg-icons'; // Import the search icon from Font Awesome
// import './App.css';
// import RecipeCreationModal from './RecipeCreationModal';


// interface HeaderProps {
//   setResults: Dispatch<SetStateAction<never[]>>;
// }
// export const Headers = () => {
//   const [inpput, setInput] = useState("");
// }
// function SearchBar({setResults }) {
//   const [input, setInput] = useState("");

//   const fetchData = (value : string) =>{
//     fetch("https://jsonplaceholder.typicode.com/users")
//     .then((response) => response.json())
//     .then(json => {
//       const results = json.filter((user : any) => {
//           return (
//           value && 
//           user && 
//           user.name && 
//           user.name.toLowerCase().includes(value)
//           );
//       });
//       setResults(results);
//     });
//   };
//   const handleChange = (value : string) => {
//     setInput(value);
//     fetchData(value);
//   }
//   const handleSearch = () => {
//     console.log('Performing search for:', setInput);
//   };

//   const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
//     if (event.key === 'Enter') {
//       handleSearch();
//     }
//   };

//   return (
//     <header className="App-header">
//       <div className="header-content">
//         <div className="center">
//           <input placeholder="Search" 
//           value={input}
//           onChange={(e) => handleChange(e.target.value)}
//           />
//           <button onClick={handleSearch} className="search-button">
//             <FontAwesomeIcon icon={faSearch} className="search-icon"/> {/* Search icon */}
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Header;


// export const SearchBar = () => {
//     return (
//         <header className="App-header">
//           <div className="header-content">
//             <div className="center">
//               <input placeholder="Search" 
//               value={input}
//               onChange={(e) => handleChange(e.target.value)}
//               />
//               <button onClick={handleSearch} className="search-button">
//                 <FontAwesomeIcon icon={faSearch} className="search-icon"/> {/* Search icon */}
//               </button>
//             </div>
//           </div>
//         </header>
//       );
// }
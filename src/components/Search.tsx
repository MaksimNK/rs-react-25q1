import React, { useState } from 'react';

interface ISearchProps {
  searchTerm: string;
  handleSearch: (query: string) => void;
}

const Search: React.FC<ISearchProps> = ({ searchTerm, handleSearch }) => {
  const [inputValue, setInputValue] = useState(searchTerm);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSearchClick = () => {
    const trimmedValue = inputValue.trim();
    handleSearch(trimmedValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearchClick();
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Let's find"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleSearchClick}>Search</button>
    </div>
  );
};

export default Search;

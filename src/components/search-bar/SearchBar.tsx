import React from "react";

interface SearchBarProps {
  searchInput: string;
  onSearchChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchInput,
  onSearchChange,
}) => {
  return (
    <form
      role="search"
      onSubmit={(e) => e.preventDefault()}
      className="ebay-search-form"
    >
      <div className="search-container">
        <div className="search-input-wrapper">
          <div className="search-icon">
            <span>🔍</span>
          </div>
          <input
            id="book-search"
            name="gsearch"
            type="search"
            value={searchInput}
            placeholder="Search for anything"
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search for books"
            className="ebay-search-input"
          />
        </div>
      </div>

      <button className="search-button" aria-label="Search">
        Search
      </button>
    </form>
  );
};

export default SearchBar;

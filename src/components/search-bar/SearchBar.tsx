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
      onSubmit={(e) => {
        e.preventDefault();
        // Announce search action to screen readers
        const results = document.querySelector(
          '[role="region"][aria-label="Search results"]'
        );
        if (results) {
          results.setAttribute("aria-busy", "true");
        }
      }}
      className="ebay-search-form"
      aria-label="Book search form"
    >
      <div className="search-container">
        <div className="search-input-wrapper">
          <label htmlFor="book-search" className="visually-hidden">
            Search for books
          </label>
          <div className="search-icon" aria-hidden="true">
            <span>🔍</span>
          </div>
          <input
            id="book-search"
            name="gsearch"
            type="search"
            value={searchInput}
            placeholder="Search for books by title, author, or keyword"
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search for books"
            className="ebay-search-input"
            aria-describedby="search-description"
          />
        </div>
      </div>

      <button
        className="search-button"
        type="submit"
        aria-label={`Search for ${searchInput || "books"}`}
      >
        Search
      </button>

      <div id="search-description" className="visually-hidden">
        Type to search for books. Results will update as you type.
      </div>
    </form>
  );
};

export default SearchBar;

import React from "react";
import { useBookSearch } from "../context/BookSearchContext";
import Wishlist from "../components/wishlist/Wishlist";
import BookCard from "../components/book-card/BookCard";
import SearchBar from "../components/search-bar/SearchBar";

const BookSearch = () => {
  const {
    searchInput,
    books,
    wishlist,
    isLoading,
    handleSearchChange,
    handleWishlistToggle,
    removeFromWishlist,
  } = useBookSearch();

  return (
    <div className="book--container">
      <div className="search-params">
        <div className="brand-text-container">
          <div className="brand-text">
            <span className="highlight-g">G</span>ood
            <span className="highlight-o1">r</span>
            <span className="highlight-o2">e</span>
            <span className="highlight-d">a</span>ds
          </div>
        </div>

        <SearchBar
          searchInput={searchInput}
          onSearchChange={handleSearchChange}
        />

        {!searchInput && !books.length && (
          <div className="empty" role="status">
            <p>
              Try searching for a topic, for example
              <button
                onClick={() => handleSearchChange("javascript")}
                className="link-button"
                aria-label="Search for JavaScript books"
              >
                "Javascript"
              </button>
            </p>
          </div>
        )}

        <div
          className="search-results"
          role="region"
          aria-label="Search results"
        >
          {isLoading ? (
            <div className="loading" role="status" aria-live="polite">
              Loading books...
            </div>
          ) : books.length > 0 ? (
            <div role="list" className="ebay-product-grid">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  isInWishlist={wishlist.some((b) => b.id === book.id)}
                  onWishlistToggle={handleWishlistToggle}
                />
              ))}
            </div>
          ) : (
            <div className="empty" role="status" aria-live="polite">
              No books found. Try a different search term.
            </div>
          )}
        </div>
      </div>

      <Wishlist wishlist={wishlist} removeFromWishlist={removeFromWishlist} />
    </div>
  );
};

export default BookSearch;

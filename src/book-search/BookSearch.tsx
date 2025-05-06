import React, { useEffect, useState, useCallback, useRef } from "react";
import { getBooksByType } from "./book-search.service";
import { Book } from "../types/Book";
import Wishlist from "../components/wishlist/Wishlist";
import BookCard from "../components/book-card/BookCard";
import SearchBar from "../components/search-bar/SearchBar";

const BookSearch = () => {
  const [searchInput, setSearchInput] = useState("javascript");
  const [books, setBooks] = useState<Book[]>([]);
  const [wishlist, setWishlist] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateRandomPrice = () => {
    const prices = ["£3.65", "£2.86", "£3.61", "£9.99"];
    return prices[Math.floor(Math.random() * prices.length)];
  };

  const generateRandomCondition = () => {
    const conditions = ["Pre-owned", "Brand new"];
    return conditions[Math.floor(Math.random() * conditions.length)];
  };

  const fetchBooks = useCallback(async (query: string) => {
    setIsLoading(true);
    try {
      const results = await getBooksByType(query);
      // Enhance books with additional eBay-like properties
      const enhancedBooks = results.map((book) => ({
        ...book,
        price: generateRandomPrice(),
        condition: generateRandomCondition(),
        discount: "Buy 1, get 1 20% off",
        deliveryInfo: "Free delivery in 3 days",
        specialLabel: Math.random() > 0.75 ? "GREAT PRICE" : "",
      }));
      setBooks(enhancedBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedSearch = useCallback(
    (query: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        if (query.trim()) {
          fetchBooks(query);
        }
      }, 500);
    },
    [fetchBooks]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Initial load
  useEffect(() => {
    fetchBooks(searchInput);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addToWishlist = (book: Book) => {
    if (!wishlist.find((b) => b.id === book.id)) {
      setWishlist((prev) => [...prev, book]);
    }
  };

  const removeFromWishlist = (bookId: string) => {
    setWishlist((prev) => prev.filter((book) => book.id !== bookId));
  };

  const handleWishlistToggle = (book: Book) => {
    if (wishlist.some((b) => b.id === book.id)) {
      removeFromWishlist(book.id);
    } else {
      addToWishlist(book);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    debouncedSearch(value);
  };

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
                onClick={() => setSearchInput("javascript")}
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
              {books.map((book: Book) => (
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

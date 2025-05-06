import React, { useEffect, useState, useCallback, useRef } from "react";
import { getBooksByType } from "./book-search.service";

interface Book {
  id: string;
  title: string;
  authors: string[];
  publisher: string;
  publishedDate: string;
  coverUrl: string;
  description: string;
  isRead: boolean;
}

const BookSearch = () => {
  const [searchInput, setSearchInput] = useState("javascript");
  const [books, setBooks] = useState<Book[]>([]);
  const [wishlist, setWishlist] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBooks = useCallback(async (query: string) => {
    setIsLoading(true);
    try {
      const results = await getBooksByType(query);
      setBooks(results);
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

  return (
    <div className="book--container">
      <div className="search-params">
        <form role="search" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="book-search" className="visually-hidden">
            Search for books
          </label>
          <input
            id="book-search"
            autoFocus
            name="gsearch"
            type="search"
            value={searchInput}
            placeholder="Search for books to add to your reading list"
            onChange={(e) => {
              const value = e.target.value;
              setSearchInput(value);
              debouncedSearch(value);
            }}
            aria-label="Search for books"
          />
        </form>

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
            <div role="list">
              {books.map((book: Book) => (
                <article key={book.id} className="book-card" role="listitem">
                  <img
                    src={
                      book.coverUrl ||
                      "https://via.placeholder.com/128x192?text=No+Cover"
                    }
                    alt={`Book cover of ${book.title}`}
                    className="book-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://via.placeholder.com/128x192?text=No+Cover";
                    }}
                  />
                  <div className="book-details">
                    <h2>{book.title}</h2>
                    <p className="authors">
                      <span className="visually-hidden">Authors: </span>
                      {book.authors?.join(", ") || "Unknown Author"}
                    </p>
                    <p className="publisher">
                      <span className="visually-hidden">Publisher: </span>
                      {book.publisher || "Unknown Publisher"}
                    </p>
                    <p className="published-date">
                      <span className="visually-hidden">Published: </span>
                      {book.publishedDate
                        ? new Date(book.publishedDate).toLocaleDateString()
                        : "Unknown Date"}
                    </p>
                    <p className="description" aria-label="Book description">
                      {book.description || "No description available"}
                    </p>
                    <button
                      className="add-to-wishlist"
                      onClick={() => addToWishlist(book)}
                      disabled={wishlist.some((b) => b.id === book.id)}
                      aria-label={`Add ${book.title} to wishlist`}
                    >
                      {wishlist.some((b) => b.id === book.id)
                        ? "Added to Wishlist"
                        : "Add to Wishlist"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty" role="status" aria-live="polite">
              No books found. Try a different search term.
            </div>
          )}
        </div>
      </div>

      <aside
        className="wishlist-sidebar"
        role="complementary"
        aria-label="Wishlist"
      >
        <h2>My Wishlist ({wishlist.length})</h2>
        <div
          className="wishlist-books"
          role="list"
          aria-label="Books in wishlist"
        >
          {wishlist.map((book: Book) => (
            <div key={book.id} className="wishlist-book" role="listitem">
              <img
                src={
                  book.coverUrl ||
                  "https://via.placeholder.com/60x90?text=No+Cover"
                }
                alt={`Book cover of ${book.title}`}
                className="book-cover-small"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "https://via.placeholder.com/60x90?text=No+Cover";
                }}
              />
              <div className="wishlist-book-details">
                <h3>{book.title}</h3>
                <p>
                  <span className="visually-hidden">Authors: </span>
                  {book.authors?.join(", ") || "Unknown Author"}
                </p>
                <button
                  className="remove-from-wishlist"
                  onClick={() => removeFromWishlist(book.id)}
                  aria-label={`Remove ${book.title} from wishlist`}
                >
                  Remove from Wishlist
                </button>
              </div>
            </div>
          ))}
          {wishlist.length === 0 && (
            <p className="empty-wishlist" role="status" aria-live="polite">
              No books in wishlist
            </p>
          )}
        </div>
      </aside>
    </div>
  );
};

export default BookSearch;

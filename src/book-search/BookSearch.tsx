import React, { useEffect, useState } from "react";
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

  const fetchBooks = async (query: string) => {
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
  };

  useEffect(() => {
    // Load initial results
    fetchBooks(searchInput);
  }, [searchInput]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBooks(searchInput);
  };

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
        <form onSubmit={handleSearch}>
          <input
            className="full-width"
            autoFocus
            name="gsearch"
            type="search"
            value={searchInput}
            placeholder="Search for books to add to your reading list and press Enter"
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>

        {!searchInput && !books.length && (
          <div className="empty">
            <p>
              Try searching for a topic, for example
              <a
                onClick={() => {
                  setSearchInput("javascript");
                  fetchBooks("javascript");
                }}
              >
                {" "}
                "Javascript"
              </a>
            </p>
          </div>
        )}

        <div className="search-results">
          {isLoading ? (
            <div className="loading">Loading books...</div>
          ) : books.length > 0 ? (
            books.map((book: Book) => (
              <div key={book.id} className="book-card">
                <img
                  src={
                    book.coverUrl ||
                    "https://via.placeholder.com/128x192?text=No+Cover"
                  }
                  alt={book.title}
                  className="book-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://via.placeholder.com/128x192?text=No+Cover";
                  }}
                />
                <div className="book-details">
                  <h3>{book.title}</h3>
                  <p className="authors">
                    {book.authors?.join(", ") || "Unknown Author"}
                  </p>
                  <p className="publisher">
                    {book.publisher || "Unknown Publisher"}
                  </p>
                  <p className="published-date">
                    {book.publishedDate
                      ? new Date(book.publishedDate).toLocaleDateString()
                      : "Unknown Date"}
                  </p>
                  <p className="description">
                    {book.description || "No description available"}
                  </p>
                  <button
                    className="add-to-wishlist"
                    onClick={() => addToWishlist(book)}
                    disabled={wishlist.some((b) => b.id === book.id)}
                  >
                    {wishlist.some((b) => b.id === book.id)
                      ? "Added to Wishlist"
                      : "Add to Wishlist"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty">
              No books found. Try a different search term.
            </div>
          )}
        </div>
      </div>

      <div className="wishlist-sidebar">
        <h2>My Wishlist ({wishlist.length})</h2>
        <div className="wishlist-books">
          {wishlist.map((book: Book) => (
            <div key={book.id} className="wishlist-book">
              <img
                src={
                  book.coverUrl ||
                  "https://via.placeholder.com/60x90?text=No+Cover"
                }
                alt={book.title}
                className="book-cover-small"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "https://via.placeholder.com/60x90?text=No+Cover";
                }}
              />
              <div className="wishlist-book-details">
                <h4>{book.title}</h4>
                <p>{book.authors?.join(", ") || "Unknown Author"}</p>
                <button
                  className="remove-from-wishlist"
                  onClick={() => removeFromWishlist(book.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          {wishlist.length === 0 && (
            <p className="empty-wishlist">No books in wishlist</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookSearch;

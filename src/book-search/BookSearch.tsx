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
  price?: string;
  condition?: string;
  discount?: string;
  deliveryInfo?: string;
  specialLabel?: string;
}

const BookSearch = () => {
  const [searchInput, setSearchInput] = useState("javascript");
  const [books, setBooks] = useState<Book[]>([]);
  const generateRandomPrice = () => {
    const prices = ["£3.65", "£2.86", "£3.61", "£9.99"];
    return prices[Math.floor(Math.random() * prices.length)];
  };

  const generateRandomCondition = () => {
    const conditions = ["Pre-owned", "Brand new"];
    return conditions[Math.floor(Math.random() * conditions.length)];
  };
  const [wishlist, setWishlist] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchInput(value);
                  debouncedSearch(value);
                }}
                aria-label="Search for books"
                className="ebay-search-input"
              />
            </div>
          </div>

          <button className="search-button" aria-label="Search">
            Search
          </button>
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
            <div role="list" className="ebay-product-grid">
              {books.map((book: Book) => (
                <article
                  key={book.id}
                  className="ebay-product-card"
                  role="listitem"
                >
                  {book.specialLabel && (
                    <div className="special-label">{book.specialLabel}</div>
                  )}
                  <div className="product-image-container">
                    <img
                      src={
                        book.coverUrl ||
                        "https://via.placeholder.com/128x192?text=No+Cover"
                      }
                      alt={`Book cover of ${book.title}`}
                      className="product-image"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://via.placeholder.com/128x192?text=No+Cover";
                      }}
                    />
                    <button
                      className="wishlist-heart-icon"
                      onClick={() =>
                        wishlist.some((b) => b.id === book.id)
                          ? removeFromWishlist(book.id)
                          : addToWishlist(book)
                      }
                      aria-label={`${
                        wishlist.some((b) => b.id === book.id)
                          ? "Remove from"
                          : "Add to"
                      } wishlist: ${book.title}`}
                    >
                      {wishlist.some((b) => b.id === book.id) ? "❤️" : "🤍"}
                    </button>
                  </div>
                  <div className="product-details">
                    <h2 className="product-title">{book.title}</h2>
                    <p className="product-authors">
                      <span className="visually-hidden">Authors: </span>
                      {book.authors?.join(", ") || "Unknown Author"}
                    </p>
                    <p className="product-condition">{book.condition}</p>
                    <div className="product-rating">
                      <span className="rating-stars">★★★★★</span>
                    </div>
                    <div className="product-price-container">
                      <div className="product-price">
                        <span className="price-value">{book.price}</span>
                      </div>
                      <div className="buy-now-container">
                        <span className="buy-now-text">Buy it now</span>
                      </div>
                    </div>
                    <div className="delivery-info">
                      <span>{book.deliveryInfo}</span>
                    </div>
                    <div className="discount-info">
                      <span>{book.discount}</span>
                    </div>
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
        className="ebay-sidebar"
        role="complementary"
        aria-label="Watchlist"
      >
        <div className="sidebar-header">
          <h2>Your Watchlist ({wishlist.length})</h2>
        </div>
        <div
          className="watchlist-items"
          role="list"
          aria-label="Books in watchlist"
        >
          {wishlist.map((book: Book) => (
            <div key={book.id} className="watchlist-item" role="listitem">
              <div className="watchlist-item-image">
                <img
                  src={
                    book.coverUrl ||
                    "https://via.placeholder.com/60x90?text=No+Cover"
                  }
                  alt={`Book cover of ${book.title}`}
                  className="watchlist-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://via.placeholder.com/60x90?text=No+Cover";
                  }}
                />
              </div>
              <div className="watchlist-item-details">
                <h3 className="watchlist-item-title">{book.title}</h3>
                <p className="watchlist-item-author">
                  <span className="visually-hidden">Authors: </span>
                  {book.authors?.join(", ") || "Unknown Author"}
                </p>
                <div className="watchlist-item-price">
                  <span className="price-value">{book.price || "£9.99"}</span>
                </div>
                <div className="watchlist-item-condition">
                  <span>{book.condition || "Pre-owned"}</span>
                </div>
                <div className="watchlist-item-delivery">
                  <span>{book.deliveryInfo || "Free delivery in 3 days"}</span>
                </div>
                <div className="watchlist-item-actions">
                  <button
                    className="watchlist-remove-button"
                    onClick={() => removeFromWishlist(book.id)}
                    aria-label={`Remove ${book.title} from watchlist`}
                  >
                    Remove
                  </button>
                  <button
                    className="watchlist-cart-button"
                    aria-label={`Add ${book.title} to cart`}
                  >
                    Buy it now
                  </button>
                </div>
              </div>
            </div>
          ))}
          {wishlist.length === 0 && (
            <div className="empty-watchlist" role="status" aria-live="polite">
              <p>No items in your watchlist</p>
              <p className="empty-watchlist-message">
                Find something you like? Add it to your Watchlist to keep track
                of it.
              </p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default BookSearch;

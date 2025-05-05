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
  const [bookType, updateBookType] = useState("");
  const [bookTypeToSearch, updateBookTypeToSearch] = useState("");
  const [allAvailableBooks, setAllAvailableBooks] = useState<Book[]>([]);
  const [wishlist, setWishlist] = useState<Book[]>([]);

  async function requestBooks() {
    if (bookTypeToSearch) {
      const allBooks = await getBooksByType(bookTypeToSearch);
      setAllAvailableBooks(allBooks);
    }
  }

  useEffect(() => {
    async function getAllBooks() {
      await requestBooks();
    }
    getAllBooks();
  }, [bookTypeToSearch, requestBooks]);

  const addToWishlist = (book: Book) => {
    if (!wishlist.find((b) => b.id === book.id)) {
      setWishlist([...wishlist, book]);
    }
  };

  const removeFromWishlist = (bookId: string) => {
    setWishlist(wishlist.filter((book) => book.id !== bookId));
  };

  return (
    <div className="book--container">
      <div className="search-params">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateBookTypeToSearch(bookType);
          }}
        >
          <input
            className="full-width"
            autoFocus
            name="gsearch"
            type="search"
            value={bookType}
            placeholder="Search for books to add to your reading list and press Enter"
            onChange={(e) => updateBookType(e.target.value)}
          />
        </form>
        {!bookType && (
          <div className="empty">
            <p>
              Try searching for a topic, for example
              <a
                onClick={() => {
                  updateBookType("Javascript");
                }}
              >
                {" "}
                "Javascript"
              </a>
            </p>
          </div>
        )}

        <div className="search-results">
          {allAvailableBooks.map((book: Book) => (
            <div key={book.id} className="book-card">
              <img
                src={book.coverUrl}
                alt={book.title}
                className="book-cover"
              />
              <div className="book-details">
                <h3>{book.title}</h3>
                <p className="authors">{book.authors?.join(", ")}</p>
                <p className="publisher">{book.publisher}</p>
                <p className="published-date">
                  {new Date(book.publishedDate).toLocaleDateString()}
                </p>
                <p className="description">{book.description}</p>
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
          ))}
        </div>
      </div>

      <div className="wishlist-sidebar">
        <h2>My Wishlist</h2>
        <div className="wishlist-books">
          {wishlist.map((book: Book) => (
            <div key={book.id} className="wishlist-book">
              <img
                src={book.coverUrl}
                alt={book.title}
                className="book-cover-small"
              />
              <div className="wishlist-book-details">
                <h4>{book.title}</h4>
                <p>{book.authors?.join(", ")}</p>
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

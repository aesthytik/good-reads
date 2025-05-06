import React from "react";
import "./styles/App.scss";
import BookSearch from "./book-search/BookSearch";
import { BookSearchProvider } from "./context/BookSearchContext";

function App() {
  return (
    <BookSearchProvider>
      <div className="app-container">
        <a href="#main-content" className="visually-hidden skip-link">
          Skip to main content
        </a>

        <header>
          <h1 className="visually-hidden">
            My Good Reads - Book Search and Wishlist
          </h1>
        </header>

        <main id="main-content" tabIndex={-1}>
          <BookSearch />
        </main>

        {/* Live regions for screen reader announcements */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="visually-hidden"
          role="status"
          id="search-status"
        >
          {/* Search updates will be announced here */}
        </div>
        <div
          aria-live="assertive"
          aria-atomic="true"
          className="visually-hidden"
          role="alert"
          id="wishlist-status"
        >
          {/* Wishlist updates will be announced here */}
        </div>
      </div>
    </BookSearchProvider>
  );
}

export default App;

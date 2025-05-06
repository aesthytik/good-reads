import React from "react";
import "./styles/App.scss";
import BookSearch from "./book-search/BookSearch";
import { BookSearchProvider } from "./context/BookSearchContext";

function App() {
  return (
    <BookSearchProvider>
      <div className="app-container">
        {/* Main content area */}
        <main>
          <BookSearch />
        </main>

        {/* Hidden live region for screen reader announcements */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="visually-hidden"
          role="status"
        >
          {/* Dynamic content updates will be announced here */}
        </div>
      </div>
    </BookSearchProvider>
  );
}

export default App;

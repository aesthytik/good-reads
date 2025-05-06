import React from "react";
import "./styles/App.scss";
import BookSearch from "./book-search/BookSearch";

function App() {
  return (
    <div className="app-container">
      {/* Skip to main content link for keyboard users */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* <header className="header" role="banner">
        <div className="header--content">
          <div className="header-top">
            <div className="header-left">
              <div className="logo">
                <span className="logo-text">
                  my<span className="logo-highlight">GoodReads</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </header> */}

      {/* Category navigation */}

      {/* Main content area */}
      <main id="main-content" tabIndex={-1}>
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
  );
}

export default App;

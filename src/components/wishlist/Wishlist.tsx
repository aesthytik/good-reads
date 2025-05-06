import React from "react";
import { Book } from "../../types/Book";

interface WishlistProps {
  wishlist: Book[];
  removeFromWishlist: (bookId: string) => void;
}

const Wishlist: React.FC<WishlistProps> = ({
  wishlist,
  removeFromWishlist,
}) => {
  return (
    <aside className="ebay-sidebar" role="complementary" aria-label="Watchlist">
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
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iOTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPk5vIENvdmVyPC90ZXh0Pjwvc3ZnPg=="
                }
                alt={`Book cover of ${book.title}`}
                className="watchlist-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iOTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPk5vIENvdmVyPC90ZXh0Pjwvc3ZnPg==";
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
              Find something you like? Add it to your Watchlist to keep track of
              it.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Wishlist;

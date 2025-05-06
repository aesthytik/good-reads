import React from "react";
import { Book } from "../../types/Book";

interface BookCardProps {
  book: Book;
  isInWishlist: boolean;
  onWishlistToggle: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  isInWishlist,
  onWishlistToggle,
}) => {
  return (
    <article
      className="ebay-product-card"
      role="listitem"
      data-testid="book-card"
      aria-labelledby={`book-title-${book.id}`}
    >
      {book.specialLabel && (
        <div className="special-label" aria-label={book.specialLabel}>
          {book.specialLabel}
        </div>
      )}
      <div className="product-image-container">
        <img
          src={
            book.coverUrl ||
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjE5MiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+Tm8gQ292ZXI8L3RleHQ+PC9zdmc+"
          }
          alt={`Book cover of ${book.title}`}
          className="product-image"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjE5MiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+Tm8gQ292ZXI8L3RleHQ+PC9zdmc+";
          }}
        />
        <button
          className="wishlist-heart-icon"
          onClick={() => onWishlistToggle(book)}
          aria-label={`${isInWishlist ? "Remove from" : "Add to"} wishlist: ${
            book.title
          }`}
          aria-pressed={isInWishlist}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              onWishlistToggle(book);
            }
          }}
        >
          <span aria-hidden="true">{isInWishlist ? "❤️" : "🤍"}</span>
        </button>
      </div>
      <div className="product-details">
        <h2 id={`book-title-${book.id}`} className="product-title">
          {book.title}
        </h2>
        <p className="product-authors">
          <span className="visually-hidden">Authors: </span>
          {book.authors?.join(", ") || "Unknown Author"}
        </p>
        <p
          className="product-condition"
          aria-label={`Condition: ${book.condition}`}
        >
          {book.condition}
        </p>
        <div className="product-rating">
          {typeof book.rating === "number" ? (
            <div
              role="img"
              aria-label={`Rating: ${book.rating} out of 5 stars`}
              className="rating-stars"
            >
              <span aria-hidden="true">
                {"★".repeat(Math.round(book.rating))}
                {"☆".repeat(5 - Math.round(book.rating))}
              </span>
            </div>
          ) : (
            <div
              role="text"
              aria-label="Rating not available"
              className="rating-stars rating-unavailable"
            >
              <span aria-hidden="true">Not rated</span>
            </div>
          )}
        </div>
        <div className="product-price-container">
          <div className="product-price">
            <span className="price-value" aria-label={`Price: ${book.price}`}>
              {book.price}
            </span>
          </div>
          <div className="buy-now-container">
            <span
              className="buy-now-text"
              aria-label="Purchase option: Buy it now"
            >
              Buy it now
            </span>
          </div>
        </div>
        <div
          className="delivery-info"
          aria-label={`Delivery info: ${book.deliveryInfo}`}
        >
          <span>{book.deliveryInfo}</span>
        </div>
        {book.discount && (
          <div
            className="discount-info"
            aria-label={`Discount: ${book.discount}`}
          >
            <span>{book.discount}</span>
          </div>
        )}
      </div>
    </article>
  );
};

export default BookCard;

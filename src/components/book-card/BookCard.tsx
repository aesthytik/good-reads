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
    <article className="ebay-product-card" role="listitem">
      {book.specialLabel && (
        <div className="special-label">{book.specialLabel}</div>
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
        >
          {isInWishlist ? "❤️" : "🤍"}
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
  );
};

export default BookCard;

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import BookCard from "./BookCard";

const mockBook = {
  id: "1",
  title: "Test Book",
  authors: ["John Doe", "Jane Smith"],
  publisher: "Test Publisher",
  publishedDate: "2023",
  coverUrl: "https://example.com/cover.jpg",
  description: "Test description",
  isRead: false,
  price: "$19.99",
  condition: "New",
  discount: "20% off",
  deliveryInfo: "Free shipping",
  specialLabel: "Best Seller",
};

const mockBookNoOptionals = {
  id: "2",
  title: "Test Book 2",
  authors: [],
  publisher: "Test Publisher",
  publishedDate: "2023",
  coverUrl: "",
  description: "Test description",
  isRead: false,
};

describe("BookCard", () => {
  const mockToggle = jest.fn();

  beforeEach(() => {
    mockToggle.mockClear();
  });

  it("renders book information correctly", () => {
    render(
      <BookCard
        book={mockBook}
        isInWishlist={false}
        onWishlistToggle={mockToggle}
      />
    );

    expect(screen.getByText(mockBook.title)).toBeInTheDocument();
    expect(screen.getByText(mockBook.authors.join(", "))).toBeInTheDocument();
    expect(screen.getByText(mockBook.condition)).toBeInTheDocument();
    expect(screen.getByText(mockBook.price)).toBeInTheDocument();
    expect(screen.getByText(mockBook.deliveryInfo)).toBeInTheDocument();
    expect(screen.getByText(mockBook.discount)).toBeInTheDocument();
    expect(screen.getByText(mockBook.specialLabel)).toBeInTheDocument();
  });

  it("handles wishlist toggle correctly", () => {
    render(
      <BookCard
        book={mockBook}
        isInWishlist={false}
        onWishlistToggle={mockToggle}
      />
    );

    const wishlistButton = screen.getByRole("button", {
      name: /add to wishlist/i,
    });

    fireEvent.click(wishlistButton);
    expect(mockToggle).toHaveBeenCalledWith(mockBook);
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it("displays correct wishlist icon based on status", () => {
    const { rerender } = render(
      <BookCard
        book={mockBook}
        isInWishlist={false}
        onWishlistToggle={mockToggle}
      />
    );

    expect(screen.getByText("🤍")).toBeInTheDocument();

    rerender(
      <BookCard
        book={mockBook}
        isInWishlist={true}
        onWishlistToggle={mockToggle}
      />
    );

    expect(screen.getByText("❤️")).toBeInTheDocument();
  });

  it('shows "Unknown Author" when no authors provided', () => {
    render(
      <BookCard
        book={mockBookNoOptionals}
        isInWishlist={false}
        onWishlistToggle={mockToggle}
      />
    );

    expect(screen.getByText("Unknown Author")).toBeInTheDocument();
  });

  it("uses fallback image on image load error", () => {
    render(
      <BookCard
        book={mockBookNoOptionals}
        isInWishlist={false}
        onWishlistToggle={mockToggle}
      />
    );

    const image = screen.getByRole("img");
    fireEvent.error(image);

    expect(image.getAttribute("src")).toContain("base64");
  });

  it("does not render special label when not provided", () => {
    render(
      <BookCard
        book={mockBookNoOptionals}
        isInWishlist={false}
        onWishlistToggle={mockToggle}
      />
    );

    expect(screen.queryByTestId("special-label")).not.toBeInTheDocument();
  });
});

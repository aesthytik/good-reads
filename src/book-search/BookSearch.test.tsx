import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import BookSearch from "./BookSearch";
import * as bookService from "./book-search.service";
import { BookSearchProvider } from "../context/BookSearchContext";
import { Book } from "../types/Book";

// Mock the book service
jest.mock("./book-search.service");
const mockGetBooksByType = bookService.getBooksByType as jest.Mock;

const mockBooks: Book[] = [
  {
    id: "1",
    title: "React Testing",
    authors: ["John Doe"],
    description: "A book about testing React applications",
    coverUrl: "test-cover.jpg",
    publisher: "Test Publisher",
    publishedDate: "2023",
    isRead: false,
    price: "£9.99",
    condition: "Brand new",
    discount: "Buy 1, get 1 20% off",
    deliveryInfo: "Free delivery in 3 days",
    specialLabel: "GREAT PRICE",
  },
];

const renderWithProvider = (component: React.ReactElement) => {
  return render(<BookSearchProvider>{component}</BookSearchProvider>);
};

describe("BookSearch Component", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockGetBooksByType.mockResolvedValue(mockBooks);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test("should load books on initial render", async () => {
    renderWithProvider(<BookSearch />);

    await waitFor(() => {
      expect(mockGetBooksByType).toHaveBeenCalledWith("javascript");
      expect(mockGetBooksByType).toHaveBeenCalledTimes(1);
    });

    // Verify books are displayed
    expect(await screen.findByText("React Testing")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  test("should debounce search input with 500ms delay", async () => {
    const { getByLabelText } = renderWithProvider(<BookSearch />);
    mockGetBooksByType.mockClear();

    const searchInput = getByLabelText("Search for books");
    fireEvent.change(searchInput, { target: { value: "react" } });

    // API should not be called immediately
    expect(mockGetBooksByType).not.toHaveBeenCalled();

    // Fast-forward timer by 300ms
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(mockGetBooksByType).not.toHaveBeenCalled();

    // Complete the 500ms debounce
    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(mockGetBooksByType).toHaveBeenCalledTimes(1);
    expect(mockGetBooksByType).toHaveBeenCalledWith("react");
  });

  test("should cancel previous debounce timer when typing quickly", async () => {
    const { getByLabelText } = renderWithProvider(<BookSearch />);
    mockGetBooksByType.mockClear();

    const searchInput = getByLabelText("Search for books");

    // Type "type"
    fireEvent.change(searchInput, { target: { value: "type" } });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Type "typescript" before debounce completes
    fireEvent.change(searchInput, { target: { value: "typescript" } });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockGetBooksByType).not.toHaveBeenCalledWith("type");

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(mockGetBooksByType).toHaveBeenCalledTimes(1);
    expect(mockGetBooksByType).toHaveBeenCalledWith("typescript");
  });

  test("should allow adding and removing books from wishlist", async () => {
    renderWithProvider(<BookSearch />);

    await waitFor(() => {
      expect(screen.getByText("React Testing")).toBeInTheDocument();
    });

    // Add to wishlist
    const wishlistButton = screen.getByRole("button", {
      name: /add to wishlist/i,
    });
    fireEvent.click(wishlistButton);

    // Book should be in wishlist (button should change to remove)
    expect(
      screen.getByRole("button", { name: /remove from wishlist/i })
    ).toBeInTheDocument();

    // Remove from wishlist
    const removeButton = screen.getByRole("button", {
      name: /remove from wishlist/i,
    });
    fireEvent.click(removeButton);

    // Book should be removed from wishlist (button should change back to add)
    expect(
      screen.getByRole("button", { name: /add to wishlist/i })
    ).toBeInTheDocument();
  });
});

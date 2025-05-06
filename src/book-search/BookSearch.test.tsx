import React from "react";
import { render } from "@testing-library/react";
import { act, Simulate } from "react-dom/test-utils";
import "@testing-library/jest-dom/extend-expect";
import BookSearch from "./BookSearch";
import * as bookService from "./book-search.service";

// Mock the book service
jest.mock("./book-search.service");
const mockGetBooksByType = bookService.getBooksByType as jest.Mock;

describe("BookSearch Component", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockGetBooksByType.mockResolvedValue([]);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test("should load books on initial render", async () => {
    render(<BookSearch />);

    // Initial search should happen immediately
    expect(mockGetBooksByType).toHaveBeenCalledWith("javascript");
    expect(mockGetBooksByType).toHaveBeenCalledTimes(1);
  });

  test("should debounce search input with 500ms delay", async () => {
    // Clear any previous calls
    mockGetBooksByType.mockClear();

    // Render the component once
    const { getByLabelText } = render(<BookSearch />);

    // Clear the initial call that happens on mount
    mockGetBooksByType.mockClear();

    // Get the search input
    const searchInput = getByLabelText("Search for books");

    // Type "react" in the search input
    // Use Simulate from react-dom/test-utils instead of fireEvent
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    )?.set;

    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(searchInput, "react");
      Simulate.change(searchInput);
    }

    // API should not be called immediately after typing
    expect(mockGetBooksByType).not.toHaveBeenCalled();

    // Fast-forward time by 300ms
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // API should still not be called
    expect(mockGetBooksByType).not.toHaveBeenCalled();

    // Fast-forward time to 500ms
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // API should be called once after the debounce period
    expect(mockGetBooksByType).toHaveBeenCalledTimes(1);
    expect(mockGetBooksByType).toHaveBeenCalledWith("react");
  });

  test("should cancel previous debounce timer when typing quickly", async () => {
    // Clear any previous calls
    mockGetBooksByType.mockClear();

    // Render the component once
    const { getByLabelText } = render(<BookSearch />);

    // Clear the initial call that happens on mount
    mockGetBooksByType.mockClear();

    // Get the search input
    const searchInput = getByLabelText("Search for books");

    // Type "type" in the search input
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    )?.set;

    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(searchInput, "type");
      Simulate.change(searchInput);
    }

    // Fast-forward time by 300ms
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Continue typing to "typescript"
    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(searchInput, "typescript");
      Simulate.change(searchInput);
    }

    // Fast-forward time by 300ms again
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // API should not be called yet for "type"
    expect(mockGetBooksByType).not.toHaveBeenCalledWith("type");

    // Fast-forward time to complete the debounce period for "typescript"
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // API should be called once with the final value
    expect(mockGetBooksByType).toHaveBeenCalledTimes(1);
    expect(mockGetBooksByType).toHaveBeenCalledWith("typescript");
  });
});

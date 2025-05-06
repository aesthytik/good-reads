import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchBar from "./SearchBar";

describe("SearchBar", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders with initial search input", () => {
    const searchText = "initial search";
    render(
      <SearchBar searchInput={searchText} onSearchChange={mockOnChange} />
    );

    const searchInput = screen.getByRole("searchbox");
    expect(searchInput).toHaveValue(searchText);
  });

  it("calls onSearchChange when input value changes", () => {
    render(<SearchBar searchInput="" onSearchChange={mockOnChange} />);

    const searchInput = screen.getByRole("searchbox");
    fireEvent.change(searchInput, { target: { value: "new search" } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith("new search");
  });

  it("prevents form submission", () => {
    const preventDefaultSpy = jest.spyOn(Event.prototype, "preventDefault");
    render(<SearchBar searchInput="" onSearchChange={mockOnChange} />);

    const form = screen.getByRole("search");
    fireEvent.submit(form);

    expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
    preventDefaultSpy.mockRestore();
  });

  it("has correct accessibility attributes", () => {
    render(<SearchBar searchInput="" onSearchChange={mockOnChange} />);

    const searchInput = screen.getByRole("searchbox");
    const searchButton = screen.getByRole("button");

    expect(searchInput).toHaveAttribute("aria-label", "Search for books");
    expect(searchButton).toHaveAttribute("aria-label", "Search");
  });

  it("displays correct placeholder text", () => {
    render(<SearchBar searchInput="" onSearchChange={mockOnChange} />);

    const searchInput = screen.getByRole("searchbox");
    expect(searchInput).toHaveAttribute("placeholder", "Search for anything");
  });

  it("renders search icon", () => {
    render(<SearchBar searchInput="" onSearchChange={mockOnChange} />);

    expect(screen.getByText("🔍")).toBeInTheDocument();
  });
});

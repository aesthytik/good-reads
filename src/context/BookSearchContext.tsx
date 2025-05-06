import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { Book } from "../types/Book";
import { getBooksByType } from "../book-search/book-search.service";
import { useDebounce } from "../hooks/useDebounce";

interface BookSearchContextType {
  searchInput: string;
  books: Book[];
  wishlist: Book[];
  isLoading: boolean;
  handleSearchChange: (value: string) => void;
  handleWishlistToggle: (book: Book) => void;
  removeFromWishlist: (bookId: string) => void;
}

const BookSearchContext = createContext<BookSearchContextType | undefined>(
  undefined
);

export const BookSearchProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [wishlist, setWishlist] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearchInput = useDebounce(searchInput, 500);

  const generateRandomPrice = () => {
    const prices = ["£3.65", "£2.86", "£3.61", "£9.99"];
    return prices[Math.floor(Math.random() * prices.length)];
  };

  const generateRandomCondition = () => {
    const conditions = ["Pre-owned", "Brand new"];
    return conditions[Math.floor(Math.random() * conditions.length)];
  };

  const fetchBooks = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const results = await getBooksByType(query);
      const enhancedBooks = results.map((book) => ({
        ...book,
        price: generateRandomPrice(),
        condition: generateRandomCondition(),
        discount: "Buy 1, get 1 20% off",
        deliveryInfo: "Free delivery in 3 days",
        specialLabel: Math.random() > 0.75 ? "GREAT PRICE" : "",
      }));
      setBooks(enhancedBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const addToWishlist = useCallback(
    (book: Book) => {
      if (!wishlist.find((b) => b.id === book.id)) {
        setWishlist((prev) => [...prev, book]);
      }
    },
    [wishlist]
  );

  const removeFromWishlist = useCallback((bookId: string) => {
    setWishlist((prev) => prev.filter((book) => book.id !== bookId));
  }, []);

  const handleWishlistToggle = useCallback(
    (book: Book) => {
      if (wishlist.some((b) => b.id === book.id)) {
        removeFromWishlist(book.id);
      } else {
        addToWishlist(book);
      }
    },
    [wishlist, removeFromWishlist, addToWishlist]
  );

  // Effect for debounced search
  useEffect(() => {
    fetchBooks(debouncedSearchInput);
  }, [debouncedSearchInput, fetchBooks]);

  const value = {
    searchInput,
    books,
    wishlist,
    isLoading,
    handleSearchChange,
    handleWishlistToggle,
    removeFromWishlist,
  };

  return (
    <BookSearchContext.Provider value={value}>
      {children}
    </BookSearchContext.Provider>
  );
};

export const useBookSearch = () => {
  const context = useContext(BookSearchContext);
  if (context === undefined) {
    throw new Error("useBookSearch must be used within a BookSearchProvider");
  }
  return context;
};

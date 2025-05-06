import { getBooksByType } from "./book-search.service";
import fetchUrl from "./../shared/fetchUrl/fetchUrl";

jest.mock("./../shared/fetchUrl/fetchUrl");

describe("book-search service", () => {
  const mockFetchUrl = fetchUrl as jest.MockedFunction<typeof fetchUrl>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches and transforms books correctly", async () => {
    const mockResponse = {
      items: [
        {
          id: "123",
          volumeInfo: {
            title: "Test Book",
            authors: ["Author 1", "Author 2"],
            publisher: "Test Publisher",
            publishedDate: "2023",
            description: "Test Description",
            imageLinks: {
              thumbnail: "http://example.com/image.jpg",
            },
          },
        },
      ],
    };

    mockFetchUrl.mockResolvedValueOnce(mockResponse);

    const result = await getBooksByType("fiction");

    expect(mockFetchUrl).toHaveBeenCalledWith(
      "https://www.googleapis.com/books/v1/volumes?q=fiction&maxResults=20",
      expect.any(Object)
    );

    expect(result).toEqual([
      {
        id: "123",
        title: "Test Book",
        authors: ["Author 1", "Author 2"],
        publisher: "Test Publisher",
        publishedDate: "2023",
        description: "Test Description",
        coverUrl: "https://example.com/image.jpg",
        isRead: false,
      },
    ]);
  });

  it("handles empty response", async () => {
    mockFetchUrl.mockResolvedValueOnce({ items: [] });

    const result = await getBooksByType("nonexistent");

    expect(result).toEqual([]);
  });

  it("handles response with no items property", async () => {
    mockFetchUrl.mockResolvedValueOnce({});

    const result = await getBooksByType("invalid");

    expect(result).toEqual([]);
  });

  it("handles API errors", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    mockFetchUrl.mockRejectedValueOnce(new Error("API Error"));

    const result = await getBooksByType("error");

    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching books:",
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });

  it("handles missing book fields", async () => {
    const mockResponse = {
      items: [
        {
          id: "123",
          volumeInfo: {
            title: "Test Book",
            // All other fields missing
          },
        },
      ],
    };

    mockFetchUrl.mockResolvedValueOnce(mockResponse);

    const result = await getBooksByType("minimal");

    expect(result).toEqual([
      {
        id: "123",
        title: "Test Book",
        authors: [],
        publisher: "",
        publishedDate: "",
        description: "",
        coverUrl: "",
        isRead: false,
      },
    ]);
  });

  it("properly encodes search query", async () => {
    mockFetchUrl.mockResolvedValueOnce({ items: [] });

    await getBooksByType("sci fi & fantasy");

    expect(mockFetchUrl).toHaveBeenCalledWith(
      "https://www.googleapis.com/books/v1/volumes?q=sci%20fi%20%26%20fantasy&maxResults=20",
      expect.any(Object)
    );
  });

  it("handles missing volumeInfo", async () => {
    const mockResponse = {
      items: [
        {
          id: "123",
          // Missing volumeInfo
        },
      ],
    };

    mockFetchUrl.mockResolvedValueOnce(mockResponse);

    const result = await getBooksByType("bad-data");

    expect(result).toEqual([
      {
        id: "123",
        title: "Unknown Title",
        authors: [],
        publisher: "",
        publishedDate: "",
        description: "",
        coverUrl: "",
        isRead: false,
      },
    ]);
  });
});

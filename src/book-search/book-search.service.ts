import fetchUrl from "./../shared/fetchUrl/fetchUrl";

interface VolumeInfo {
  title: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  imageLinks?: {
    thumbnail: string;
  };
}

interface BookItem {
  id: string;
  volumeInfo: VolumeInfo;
}

interface GoogleBookResponse {
  items: BookItem[];
}

interface Book {
  id: string;
  title: string;
  authors: string[];
  publisher: string;
  publishedDate: string;
  coverUrl: string;
  description: string;
  isRead: boolean;
}

export async function getBooksByType(type: string): Promise<Book[]> {
  try {
    const response: GoogleBookResponse = await fetchUrl(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        type
      )}&maxResults=20`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      }
    );

    if (!response.items) return [];

    return response.items.map((item: BookItem) => ({
      id: item.id,
      title: item.volumeInfo?.title || "Unknown Title",
      authors: item.volumeInfo?.authors || [],
      publisher: item.volumeInfo?.publisher || "",
      publishedDate: item.volumeInfo?.publishedDate || "",
      coverUrl:
        item.volumeInfo?.imageLinks?.thumbnail?.replace("http:", "https:") ||
        "",
      description: item.volumeInfo?.description || "",
      isRead: false,
    }));
  } catch (exception) {
    console.error("Error fetching books:", exception);
    return [];
  }
}

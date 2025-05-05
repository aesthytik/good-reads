import fetchUrl from "./../shared/fetchUrl/fetchUrl";

interface GoogleBookResponse {
  items: {
    id: string;
    volumeInfo: {
      title: string;
      authors: string[];
      publisher: string;
      publishedDate: string;
      description: string;
      imageLinks?: {
        thumbnail: string;
      };
    };
  }[];
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
      )}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      }
    );

    return (
      response.items?.map((item) => ({
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors || [],
        publisher: item.volumeInfo.publisher || "",
        publishedDate: item.volumeInfo.publishedDate || "",
        coverUrl: item.volumeInfo.imageLinks?.thumbnail || "",
        description: item.volumeInfo.description || "",
        isRead: false,
      })) || []
    );
  } catch (exception) {
    console.error("Error fetching books:", exception);
    return [];
  }
}

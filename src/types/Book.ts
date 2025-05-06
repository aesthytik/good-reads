export interface Book {
  id: string;
  title: string;
  authors: string[];
  publisher: string;
  publishedDate: string;
  coverUrl: string;
  description: string;
  isRead: boolean;
  price?: string;
  condition?: string;
  discount?: string;
  deliveryInfo?: string;
  specialLabel?: string;
  rating?: number;
}

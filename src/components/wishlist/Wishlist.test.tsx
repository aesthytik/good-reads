import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Wishlist from './Wishlist';

const mockBooks = [
  {
    id: '1',
    title: 'Book 1',
    authors: ['Author 1', 'Author 2'],
    publisher: 'Publisher 1',
    publishedDate: '2023',
    coverUrl: 'https://example.com/cover1.jpg',
    description: 'Description 1',
    isRead: false,
    price: '£10.99',
    condition: 'New',
    deliveryInfo: 'Next day delivery'
  },
  {
    id: '2',
    title: 'Book 2',
    authors: [],
    publisher: 'Publisher 2',
    publishedDate: '2024',
    coverUrl: '',
    description: 'Description 2',
    isRead: false
  }
];

describe('Wishlist', () => {
  const mockRemoveFromWishlist = jest.fn();

  beforeEach(() => {
    mockRemoveFromWishlist.mockClear();
  });

  it('renders wishlist with correct number of items', () => {
    render(
      <Wishlist
        wishlist={mockBooks}
        removeFromWishlist={mockRemoveFromWishlist}
      />
    );

    expect(screen.getByText('Your Watchlist (2)')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('renders empty wishlist message when no items', () => {
    render(
      <Wishlist
        wishlist={[]}
        removeFromWishlist={mockRemoveFromWishlist}
      />
    );

    expect(screen.getByText('No items in your watchlist')).toBeInTheDocument();
    expect(screen.getByText(/Find something you like\?/)).toBeInTheDocument();
  });

  it('handles remove from wishlist', () => {
    render(
      <Wishlist
        wishlist={mockBooks}
        removeFromWishlist={mockRemoveFromWishlist}
      />
    );

    const removeButton = screen.getByLabelText('Remove Book 1 from watchlist');
    fireEvent.click(removeButton);

    expect(mockRemoveFromWishlist).toHaveBeenCalledWith('1');
    expect(mockRemoveFromWishlist).toHaveBeenCalledTimes(1);
  });

  it('displays fallback values for optional book properties', () => {
    render(
      <Wishlist
        wishlist={mockBooks}
        removeFromWishlist={mockRemoveFromWishlist}
      />
    );

    // Book 2 should show fallback values
    expect(screen.getByText('Unknown Author')).toBeInTheDocument();
    expect(screen.getByText('£9.99')).toBeInTheDocument();
    expect(screen.getByText('Pre-owned')).toBeInTheDocument();
    expect(screen.getByText('Free delivery in 3 days')).toBeInTheDocument();
  });

  it('has correct accessibility attributes', () => {
    render(
      <Wishlist
        wishlist={mockBooks}
        removeFromWishlist={mockRemoveFromWishlist}
      />
    );

    expect(screen.getByRole('complementary')).toHaveAttribute('aria-label', 'Watchlist');
    expect(screen.getByRole('list')).toHaveAttribute('aria-label', 'Books in watchlist');
  });

  it('handles image load errors', () => {
    render(
      <Wishlist
        wishlist={mockBooks}
        removeFromWishlist={mockRemoveFromWishlist}
      />
    );

    const images = screen.getAllByRole('img');
    fireEvent.error(images[1]); // Testing error on the second book with empty coverUrl

    expect(images[1].getAttribute('src')).toContain('base64');
  });

  it('renders buy it now buttons for each item', () => {
    render(
      <Wishlist
        wishlist={mockBooks}
        removeFromWishlist={mockRemoveFromWishlist}
      />
    );

    const buyButtons = screen.getAllByText('Buy it now');
    expect(buyButtons).toHaveLength(2);
    expect(buyButtons[0]).toHaveAttribute('aria-label', 'Add Book 1 to cart');
  });
});

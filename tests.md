# Test Documentation

## End-to-End Tests (Cypress)

### App E2E Tests (`cypress/e2e/app.cy.ts`)

Tests the core application functionality:

- **Setup**:

  - Intercepts API calls to Google Books API
  - Visits the homepage with extended timeout
  - Verifies search input is visible

- **Test Cases**:

  1. `should load the application`

     - Verifies the search bar is visible on load

  2. `should be able to type in search bar`

     - Tests search input functionality
     - Verifies input value updates correctly

  3. `should have a working search bar`
     - Tests end-to-end search functionality
     - Verifies API call completion
     - Confirms book cards appear in results

### Wishlist E2E Tests (`cypress/e2e/wishlist.cy.ts`)

Tests the wishlist functionality through the user interface:

- **Setup**:

  - Intercepts API calls to Google Books API
  - Visits the homepage
  - Sets up test data with a mock book

- **Test Cases**:

  1. `should add a book to wishlist`

     - Verifies the initial wishlist button state (empty heart)
     - Adds book to wishlist
     - Verifies button state changes (filled heart)
     - Confirms aria-label updates appropriately

  2. `should remove a book from wishlist`
     - Adds book to wishlist
     - Removes book from wishlist
     - Verifies button state returns to initial state
     - Confirms aria-label updates appropriately

### Book Search Service Tests (`src/book-search/book-search.service.test.ts`)

Tests the book search service functionality:

- **Test Cases**:

  1. `fetches and transforms books correctly`

     - Tests successful API response handling
     - Verifies data transformation
     - Validates book object structure

  2. `handles empty response`

     - Tests behavior when API returns no books

  3. `handles response with no items property`

     - Tests error handling for malformed API responses

  4. `handles API errors`

     - Tests error handling for API failures
     - Verifies error logging
     - Ensures graceful failure with empty array return

  5. `handles missing book fields`

     - Tests data normalization for incomplete book data
     - Verifies default values for missing fields

  6. `properly encodes search query`

     - Tests URL encoding for special characters in search queries

  7. `handles missing volumeInfo`
     - Tests fallback behavior for malformed book data
     - Verifies default values for missing volumeInfo

## Unit Tests

### BookCard Component Tests (`src/components/book-card/BookCard.test.tsx`)

Tests the book card component functionality:

- **Test Cases**:

  1. `renders book information correctly`

     - Verifies all book information displays correctly (title, authors, condition, price, etc.)

  2. `handles wishlist toggle correctly`

     - Tests wishlist button click functionality
     - Verifies correct callback handling

  3. `displays correct wishlist icon based on status`

     - Verifies heart icon changes between empty (🤍) and filled (❤️) states

  4. `shows "Unknown Author" when no authors provided`

     - Tests fallback behavior for missing author information

  5. `uses fallback image on image load error`

     - Verifies image error handling
     - Confirms fallback to base64 image

  6. `does not render special label when not provided`
     - Tests conditional rendering of special labels

### Custom Hook Tests (`src/hooks/useDebounce.test.ts`)

Tests the debounce custom hook functionality:

- **Test Cases**:

  1. `returns initial value immediately`

     - Verifies immediate return of initial value
     - Tests synchronous behavior

  2. `updates value after specified delay`

     - Tests debounced value update timing
     - Verifies state after delay completion

  3. `does not update if unmounted`

     - Tests cleanup on component unmount
     - Verifies memory leak prevention

  4. `cancels previous timer on new value`

     - Tests debounce reset behavior
     - Verifies only last value is applied
     - Ensures proper timer cancellation

  5. `handles different delay values`
     - Tests dynamic delay times
     - Verifies timing accuracy

### SearchBar Component Tests (`src/components/search-bar/SearchBar.test.tsx`)

Tests the search bar component functionality:

- **Test Cases**:

  1. `renders with initial search input`

     - Verifies initial search text is displayed correctly

  2. `calls onSearchChange when input value changes`

     - Tests input change handler
     - Verifies callback is called with correct value

  3. `prevents form submission`

     - Tests form submission prevention
     - Verifies preventDefault is called

  4. `has correct accessibility attributes`

     - Tests aria-label attributes on search input and button
     - Ensures accessibility compliance

  5. `displays correct placeholder text`

     - Verifies placeholder text content

  6. `renders search icon`
     - Confirms search icon visibility

### Remaining Unit Test Files (To Be Reviewed)

1. `src/App.test.tsx`
2. `src/book-search/BookSearch.test.tsx`
3. `src/components/wishlist/Wishlist.test.tsx`
4. `src/shared/fetchUrl/fetchUrl.spec.ts`

## Test Coverage

The application implements a comprehensive testing strategy using:

- **Cypress** for end-to-end testing

  - User journey testing
  - API integration verification
  - Real browser interaction simulation
  - Network request mocking

- **Jest** for unit testing

  - Service functions
  - Utility functions
  - Custom hooks
  - API error handling
  - Timer mocking for async operations

- **React Testing Library** for component testing
  - Component rendering
  - User interactions
  - Event handling
  - Accessibility compliance
  - State management
  - Props validation

Major features covered:

- Book search functionality

  - Search input handling
  - API integration
  - Results display
  - Error handling
  - Query debouncing

- Wishlist management

  - Add/remove functionality
  - State persistence
  - UI updates
  - User feedback

- UI Components

  - Rendering accuracy
  - User interactions
  - Responsive behavior
  - Error states
  - Loading states

- Performance

  - Debounced search
  - Component cleanup
  - Memory management
  - Timer handling

- Accessibility
  - ARIA attributes
  - Screen reader support
  - Keyboard navigation
  - Form handling

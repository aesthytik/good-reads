describe("Wishlist functionality", () => {
  beforeEach(() => {
    // Set up API intercept with mock response
    cy.intercept(
      {
        method: "GET",
        url: "https://www.googleapis.com/books/v1/volumes?q=*&maxResults=20",
      },
      {
        statusCode: 200,
        body: {
          items: [
            {
              id: "test-book-1",
              volumeInfo: {
                title: "Test Book",
                authors: ["Test Author"],
                imageLinks: {
                  thumbnail: "test-image-url",
                },
              },
            },
          ],
        },
      }
    ).as("searchBooks");

    // Visit page and wait for initial load
    cy.visit("/");

    // Wait for search bar to be visible
    cy.get('input[type="search"]').should("be.visible");

    // Clear existing search and type new query
    cy.get('input[type="search"]').clear().type("test book", { delay: 100 });

    // Wait for API response and DOM update
    cy.wait("@searchBooks");
    cy.get('[data-testid="book-card"]', { timeout: 10000 }).should("exist");
  });

  it("should add a book to wishlist", () => {
    // Get first book card and add to wishlist
    cy.get('[data-testid="book-card"]')
      .first()
      .within(() => {
        // Get wishlist button and verify initial state
        cy.get(".wishlist-heart-icon")
          .as("wishlistBtn")
          .should("be.visible")
          .should("contain", "🤍");

        // Click wishlist button
        cy.get("@wishlistBtn").click();

        // Wait for state update and verify
        cy.get("@wishlistBtn")
          .should("contain", "❤️")
          .invoke("attr", "aria-label")
          .should("include", "Remove from wishlist");
      });
  });

  it("should remove a book from wishlist", () => {
    cy.get('[data-testid="book-card"]')
      .first()
      .within(() => {
        // Get wishlist button
        cy.get(".wishlist-heart-icon").as("wishlistBtn").should("be.visible");

        // First add to wishlist
        cy.get("@wishlistBtn").click().should("contain", "❤️");

        // Then remove from wishlist
        cy.get("@wishlistBtn")
          .click()
          .should("contain", "🤍")
          .invoke("attr", "aria-label")
          .should("include", "Add to wishlist");
      });
  });
});

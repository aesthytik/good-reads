describe("My Good Reads App", () => {
  beforeEach(() => {
    // Set up API intercept before visiting page
    cy.intercept({
      method: "GET",
      url: "https://www.googleapis.com/books/v1/volumes?q=*&maxResults=20",
    }).as("searchBooks");

    // Visit page and wait for it to load
    cy.visit("/", { timeout: 10000 });
    cy.get('input[type="search"]', { timeout: 10000 }).should("be.visible");
  });

  it("should load the application", () => {
    cy.get('input[type="search"]').should("be.visible");
  });

  it("should be able to type in search bar", () => {
    const searchText = "Harry Potter";
    cy.get('input[type="search"]')
      .should("be.visible")
      .clear()
      .type(searchText, { delay: 100 })
      .should("have.value", searchText);
  });

  it("should have a working search bar", () => {
    cy.get('input[type="search"]')
      .should("be.visible")
      .clear()
      .type("Harry Potter", { delay: 100 })
      .should("have.value", "Harry Potter");

    // Wait for API call to complete and verify response
    cy.wait("@searchBooks", { timeout: 10000 })
      .its("response.statusCode")
      .should("eq", 200);

    // After successful API call, verify book cards appear
    cy.get('[data-testid="book-card"]', { timeout: 10000 })
      .should("exist")
      .should("have.length.at.least", 1);
  });

  describe("Wishlist functionality", () => {
    beforeEach(() => {
      // Set up API intercept before visiting page
      cy.intercept({
        method: "GET",
        url: "https://www.googleapis.com/books/v1/volumes?q=*&maxResults=20",
      }).as("searchBooks");

      // Visit page and wait for initial load
      cy.visit("/");
      cy.get('input[type="search"]').should("be.visible");

      // Search for books to test wishlist
      cy.get('input[type="search"]')
        .clear()
        .type("Harry Potter")
        .should("have.value", "Harry Potter");

      // Wait for search results
      cy.wait("@searchBooks");
      cy.get('[data-testid="book-card"]').should("have.length.at.least", 1);
    });

    it("should add a book to wishlist", () => {
      // Get first book card and add to wishlist
      cy.get('[data-testid="book-card"]')
        .first()
        .within(() => {
          // Check initial state
          cy.get(".wishlist-heart-icon")
            .should("contain", "🤍")
            .invoke("attr", "aria-label")
            .should("include", "Add to wishlist");

          // Click wishlist button
          cy.get(".wishlist-heart-icon").click();

          // Verify heart icon changed
          cy.get(".wishlist-heart-icon")
            .should("contain", "❤️")
            .invoke("attr", "aria-label")
            .should("include", "Remove from wishlist");
        });
    });

    it("should remove a book from wishlist", () => {
      // First add a book to wishlist
      cy.get('[data-testid="book-card"]')
        .first()
        .within(() => {
          cy.get(".wishlist-heart-icon").click();
          cy.get(".wishlist-heart-icon").should("contain", "❤️");
        });

      // Then remove it
      cy.get('[data-testid="book-card"]')
        .first()
        .within(() => {
          cy.get(".wishlist-heart-icon").click();

          // Verify heart icon changed back
          cy.get(".wishlist-heart-icon")
            .should("contain", "🤍")
            .invoke("attr", "aria-label")
            .should("include", "Add to wishlist");
        });
    });
  });
});

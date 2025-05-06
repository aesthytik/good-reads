describe("My Good Reads App", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should load the application", () => {
    // The search bar should be visible
    cy.get('input[type="search"]').should("be.visible");
  });

  it("should be able to type in search bar", () => {
    const searchText = "Harry Potter";
    cy.get('input[type="search"]')
      .type(searchText)
      .should("have.value", searchText);
  });

  it("should have a working search bar", () => {
    cy.get('input[type="search"]')
      .type("Harry Potter{enter}")
      .should("have.value", "Harry Potter");

    // Due to debounce, we'll wait a bit for the search to process
    cy.wait(1000);

    // After search, we expect book cards to appear
    cy.get('[data-testid="book-card"]').should("exist");
  });
});

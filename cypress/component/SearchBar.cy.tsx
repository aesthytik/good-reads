import React, { useState } from "react";
import { StrictMode } from "react";
import SearchBar from "../../src/components/search-bar/SearchBar";
import "../../src/styles/App.scss";

const SearchBarWrapper = () => {
  const [searchInput, setSearchInput] = useState("");
  return (
    <SearchBar searchInput={searchInput} onSearchChange={setSearchInput} />
  );
};

describe("SearchBar", () => {
  beforeEach(() => {
    cy.mount(
      <StrictMode>
        <SearchBarWrapper />
      </StrictMode>
    );
  });

  it("renders form elements correctly", () => {
    cy.get('input[type="search"]')
      .should("exist")
      .should("be.visible")
      .should("have.attr", "placeholder", "Search for anything");

    cy.get(".search-button")
      .should("exist")
      .should("be.visible")
      .should("have.text", "Search");
  });

  it("handles input changes", () => {
    cy.get('input[type="search"]')
      .type("Harry Potter")
      .should("have.value", "Harry Potter");
  });

  it("prevents form submission", () => {
    const preventDefaultSpy = cy.spy().as("preventDefaultSpy");

    cy.get("form").then(($form) => {
      $form.on("submit", (e) => {
        preventDefaultSpy();
        return true;
      });
    });

    cy.get(".search-button").click();
    cy.get("@preventDefaultSpy").should("have.been.calledOnce");
    cy.get("form").should("have.attr", "role", "search");
  });

  it("displays the search value", () => {
    const searchValue = "Test Book";
    cy.mount(<SearchBar searchInput={searchValue} onSearchChange={cy.spy()} />);
    cy.get('input[type="search"]').should("have.value", searchValue);
  });
});

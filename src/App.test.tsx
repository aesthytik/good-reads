import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

import "@testing-library/jest-dom";

test("renders book search interface", () => {
  const { getByRole, getByLabelText } = render(<App />);

  // Check that main search functionality is present
  const searchInput = getByLabelText("Search for books");
  const searchForm = getByRole("search");
  const mainContent = getByRole("main");

  expect(searchInput).toBeInTheDocument();
  expect(searchForm).toBeInTheDocument();
  expect(mainContent).toBeInTheDocument();
});

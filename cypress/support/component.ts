/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

import { mount } from "cypress/react";

// Register the mount command
Cypress.Commands.add("mount", mount);

// Type definitions for the mount command
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

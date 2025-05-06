import { defineConfig } from "cypress";
import webpackConfig from "./cypress/webpack.config";

export default defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
      webpackConfig,
    },
    supportFile: "cypress/support/component.ts",
    specPattern: "cypress/component/**/*.cy.{js,jsx,ts,tsx}",
  },
  e2e: {
    baseUrl: "http://localhost:3000",
    supportFile: false,
  },
});

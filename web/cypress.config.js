import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: false,
  reporter: "cypress-mochawesome-reporter",
  e2e: {
    baseUrl: "http://localhost:5173",
    experimentalRunAllSpecs: true,
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
    },
  },
});

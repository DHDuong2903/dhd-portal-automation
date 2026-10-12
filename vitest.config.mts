import { defineConfig } from "vitest/config";

// Vitest handles unit/integration tests for domain, file-processing,
// validation, execution and adapter code. Playwright owns E2E (tests/e2e).
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**", ".next/**", "app/generated/**", "tests/e2e/**"],
    // Satisfy eager env validation (lib/env) without needing a real database.
    env: {
      DATABASE_URL:
        "postgresql://portal:portal@localhost:5433/portal_automation?schema=public",
    },
  },
});

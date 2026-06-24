import { defineConfig, defineProject } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        projects: [
            defineProject({
                plugins: [tsconfigPaths()],
                test: {
                    name: "unit",
                    dir: "src/use-cases",
                },
            }),
            defineProject({
                plugins: [tsconfigPaths()],
                test: {
                    name: "e2e",
                    dir: "src/http/controllers",
                    environment:
                        "./prisma/vitest-environment-prisma/prisma-test-environment.ts",
                },
            }),
        ],
    },
})
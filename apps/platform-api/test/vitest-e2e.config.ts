import path from "node:path";
import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    swc.vite({
      jsc: {
        parser: {
          syntax: "typescript",
          decorators: true,
        },
        transform: {
          legacyDecorator: true,
          decoratorMetadata: true,
        },
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
  },
  test: {
    environment: "node",
    globals: true,
    clearMocks: true,
    include: ["test/**/*.e2e-spec.ts"],
    setupFiles: ["./test/setup/test-lifecycle.ts"],
    fileParallelism: false,
  },
});

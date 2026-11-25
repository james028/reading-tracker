import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => ({
  test: {
    fileParallelism: false,
    env: loadEnv(mode, process.cwd(), ""),
  },
}));

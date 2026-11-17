// @ts-ignore
import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";
import adapter from "@sveltejs/adapter-vercel";

export default defineConfig({
  plugins: [
    sveltekit({
      compilerOptions: {
        runes: ({ filename }) =>
          filename.split(/[/\\]/).includes("node_modules") ? undefined : true,
      },
      adapter: adapter(),
    }),
  ],
});

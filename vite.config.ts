import { defineConfig } from "vite";

// Relative base so the static build can be hosted from any sub-path (GitHub Pages, etc.).
export default defineConfig({
  base: "./",
  server: {
    port: 5173,
    open: false,
  },
  build: {
    target: "es2022",
    outDir: "dist",
  },
});

import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/smart-ac-card.ts",
      formats: ["es"],
      fileName: () => "smart-ac-card.js",
    },
    rollupOptions: {
      external: [],
      output: {
        inlineDynamicImports: true,
      },
    },
    sourcemap: true,
    target: "es2022",
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { pagesBase } from "./src/pages-base.ts";

export default defineConfig({
  plugins: [react()],
  base: pagesBase(process.env.PAGES_BASE_PATH, process.env.GITHUB_REPOSITORY),
  build: { target: "es2022" },
});

import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import GlobPlugin from "vite-plugin-glob";

export default defineConfig({
  plugins: [react(), GlobPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

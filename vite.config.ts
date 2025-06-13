import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: ".", // Root is client/
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@assets": path.resolve(__dirname, "src/assets"), // optional
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  define: {
    // Injecting VITE_API_BASE_URL into the code
    'process.env.VITE_API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL || 'http://makergrids.eba-muuyvbmf.eu-north-1.elasticbeanstalk.com')
  },
});

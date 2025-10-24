import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    host: true,
    // HTTPS disabled for local development - will be enabled in production
    // https: {
    //   key: fs.readFileSync("./frontend.key"),
    //   cert: fs.readFileSync("./frontend.crt"),
    // },
  },
  build: {
    sourcemap: mode === "development",
  },
  base: "./",
}));

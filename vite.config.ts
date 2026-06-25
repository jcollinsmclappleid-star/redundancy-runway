import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return undefined;
          }

          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) {
            return "vendor-react";
          }

          if (/[\\/]node_modules[\\/](@radix-ui)[\\/]/.test(id)) {
            return "vendor-radix";
          }

          if (/[\\/]node_modules[\\/](recharts|d3-|decimal\\.js-light|victory-vendor|react-smooth|lodash)[\\/]/.test(id)) {
            return "vendor-charts";
          }

          if (/[\\/]node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/.test(id)) {
            return "vendor-motion";
          }

          if (/[\\/]node_modules[\\/](@tanstack)[\\/]/.test(id)) {
            return "vendor-query";
          }

          if (/[\\/]node_modules[\\/](lucide-react|react-icons)[\\/]/.test(id)) {
            return "vendor-icons";
          }

          if (/[\\/]node_modules[\\/](wouter|react-helmet-async|tailwind-merge|clsx|class-variance-authority)[\\/]/.test(id)) {
            return "vendor-app-utils";
          }

          return "vendor-misc";
        },
      },
    },
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});

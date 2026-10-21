import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import { componentTagger } from "lovable-tagger";

// Dev-only: backs the photography page's layout editor. Saves a custom order and
// removals to dev-photo-layout.json and reports which photos are new vs origin/main.
const devPhotoLayout = (): Plugin => ({
  name: "dev-photo-layout",
  apply: "serve",
  configureServer(server) {
    const file = path.resolve(__dirname, "dev-photo-layout.json");
    server.middlewares.use("/__dev/photo-layout", (req, res) => {
      if (req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
          try {
            const layout = JSON.parse(body);
            if (layout === null) {
              fs.rmSync(file, { force: true });
            } else if (Array.isArray(layout.order) && Array.isArray(layout.hidden)) {
              fs.writeFileSync(file, JSON.stringify(layout, null, 2) + "\n");
            } else {
              throw new Error("bad layout");
            }
            res.statusCode = 204;
          } catch {
            res.statusCode = 400;
          }
          res.end();
        });
        return;
      }

      let newPhotos: string[] = [];
      try {
        newPhotos = execSync(
          "git diff --name-only --diff-filter=A origin/main HEAD -- public/Portfolio-Photos-WebP",
          { cwd: __dirname, encoding: "utf8" },
        )
          .split("\n")
          .filter(Boolean)
          .map((f) => path.basename(f, ".webp"));
      } catch {
        // No git or no origin/main: skip the NEW badges.
      }
      const layout = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : null;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ layout, newPhotos }));
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    devPhotoLayout(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  assetsInclude: ['**/*.md'],
}));

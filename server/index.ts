import express, { Response } from "express";
import serverRoute from "./server.js"
import { fileURLToPath } from "url";
import path from "path";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === "production";

const app = express();

let viteDevServer: any;

if (!isProduction) {
  // For development: Set up Vite in middleware mode
  import("vite")
    .then((vite) =>
      vite.createServer({
        server: { middlewareMode: true }, // Serve Vite in HTML middleware mode
      })
    )
    .then((server) => {
      viteDevServer = server;
      // API Emdpoint in Development
      app.use("/api", serverRoute);
      
      app.use(viteDevServer.middlewares); // Use Vite's dev server middlewares
      console.log("Vite Dev Server is running in development mode.");
    })
    .catch((error) => {
      console.error("Failed to set up Vite Dev Server:", error);
    });
} else {
  // For production: Serve the built static files
  app.use(express.static(path.join(__dirname, "../")));

  // API Emdpoint in Production
  app.use("/api", serverRoute);


  app.get("*", (_, res:Response) => {
    res.sendFile(path.join(__dirname, "../index.html"));
  });
  console.log("Serving production build from 'dist' folder.");
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
import type { Application } from "express";
import http, { Server } from "http";

// http or https depends on environment variables
export const createServerFromEnv = (app: Application): Server => {
  // logic to create an HTTPS server if needed

  return http.createServer(app);
};

// start the server http or https
export const bootstrap = async (
  server: Server,
  port: number
): Promise<void> => {
  try {
    server.listen(port);
    server.on("error", (err) => {
      console.error("Server error:", err);
    });
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📊 Health check: http://localhost:${port}/health`);
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

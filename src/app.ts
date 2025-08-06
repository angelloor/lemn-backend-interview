import bodyParser from "body-parser";
import cors from "cors";
import type { Application } from "express";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import {
    globalErrorHandler,
    notFoundHandler,
} from "./middlewares/error.handler";

const app: Application = express();

// Middlewares
app.use(helmet());
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization",
    exposedHeaders: "Content-Length, X-Total-Count",
    credentials: true,
  })
);
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Body Parsing
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json());

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes via TSOA V1
try {
  const { RegisterRoutes } = require("./tsoa/v1/routes");
  RegisterRoutes(app);
  console.log("✅ TSOA routes loaded successfully");
} catch (error) {
  console.log("❌ TSOA routes error:", error);
  console.log(
    "TSOA routes not available. Run 'npm run tsoa:build' to generate them."
  );
}

// Swagger documentation
try {
  const swaggerDocumentV1 = require("./tsoa/v1/swagger.json");
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocumentV1));
  console.log(
    "📚 Swagger docs available at: http://localhost:" +
      (process.env.PORT || 8080) +
      "/api/docs"
  );
} catch (error) {
  console.log(
    "Swagger documentation not available. Run 'npm run tsoa:build' to generate it."
  );
}

// Handler para rutas no encontradas
app.use(notFoundHandler);

app.use(globalErrorHandler);

// Static Files
app.use("/", express.static("./public"));

export default app;

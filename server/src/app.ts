import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import { env } from "./config/env";
import { ensureDir } from "./utils/fileUtils";
import { generalRateLimiter } from "./middleware/rateLimit.middleware";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { startCleanupScheduler } from "./services/cleanupService";

import uploadRoutes from "./routes/upload.routes";
import convertRoutes from "./routes/convert.routes";
import downloadRoutes from "./routes/download.routes";

const app = express();

// --- Security headers ---
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
    crossOriginResourcePolicy: { policy: "same-site" },
  })
);

// --- CORS: only the configured frontend origin(s) may call this API ---
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser tools (no Origin header, e.g. curl/health checks)
      if (!origin || env.clientOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "DELETE"],
    credentials: false,
  })
);

app.use(compression());
app.use(morgan(env.isProduction ? "combined" : "dev"));

// Body parsers - JSON only; file bytes come through multipart handled by multer, never JSON.
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use(generalRateLimiter);

// --- Routes ---
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

app.use("/api", uploadRoutes);
app.use("/api", convertRoutes);
app.use("/api", downloadRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function start(): Promise<void> {
  await ensureDir(env.uploadDir);
  await ensureDir(env.tempDir);
  startCleanupScheduler();

  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Server running on port ${env.port} [${env.nodeEnv}]`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start server:", err);
  process.exit(1);
});

export default app;

// =============================================================
//  FULL PRESERVED VERSION WITH ONLY CORS + ROUTE ORDER FIXED
// =============================================================

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// Validate environment variables
const { validateEnv, isProduction } = require("./utils/validateEnv");
validateEnv();

// Import console logger (respects NODE_ENV)
const consoleLogger = require("./utils/logger");

// Import database and middleware
const db = require("./config/database");
const { requestLogger, errorLogger } = require("./middleware/logger");
const { apiLimiter } = require("./middleware/rateLimiter");
const logger = require("./services/logger");

// Import LinkedIn Route
const linkedinRoutes = require("./routes/linkedin");

// Import centralized routes
const apiRoutes = require("./routes");

// Import Swagger (only if not in production)
let swaggerUi, swaggerSpec;
if (!isProduction()) {
  swaggerUi = require("swagger-ui-express");
  const swaggerConfig = require("./config/swagger");
  swaggerSpec = swaggerConfig;
}

// Upload directory generator
const ensureUploadDirs = () => {
  const uploadsDir = path.join(process.cwd(), "uploads");
  const dirs = [
    "mentors",
    "management",
    "board-trustees",
    "accreditations",
    "reports",
    "banners",
    "media",
    "our-work",
  ];

  dirs.forEach((dir) => {
    const dirPath = path.join(uploadsDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      consoleLogger.log(`✅ Created upload directory: ${dirPath}`);
    }
  });
};
ensureUploadDirs();

// Initialize app
const app = express();

// Security headers
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// Proxy trust
app.set("trust proxy", true);

// ==================== Path Prefix Detection ====================
function getBasePath(req) {
  if (process.env.API_BASE_URL) {
    try {
      const url = new URL(process.env.API_BASE_URL);
      if (url.pathname && url.pathname !== "/") {
        return url.pathname;
      }
    } catch { }
  }
  const reqPath = req.originalUrl || req.url;
  if (reqPath.startsWith("/dev/")) return "/dev";
  return "";
}

app.use((req, res, next) => {
  req.basePath = getBasePath(req);
  next();
});

// =============================================================
//  CORS — uses ALLOWED_ORIGINS env var
// =============================================================
function buildAllowedOrigins() {
  const fromEnv = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  const devDefaults = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://global.localhost:5173",
    "http://global.localhost:5174",
    "http://127.0.0.1:3000",
  ];

  const origins = isProduction()
    ? [...fromEnv]
    : [...new Set([...fromEnv, ...devDefaults])];

  const apiUrl = process.env.API_BASE_URL || "";
  if (apiUrl) {
    try {
      const url = new URL(apiUrl);
      const apiOrigin = `${url.protocol}//${url.host}`.toLowerCase();
      if (!origins.includes(apiOrigin)) {
        origins.push(apiOrigin);
      }
    } catch { }
  }

  return origins;
}

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      if (isProduction()) {
        return callback(new Error("Origin header required"));
      }
      consoleLogger.debug("CORS: Request with no origin, allowing (dev only)");
      return callback(null, true);
    }

    const allowedOrigins = buildAllowedOrigins();
    const normalized = origin.toLowerCase().replace(/\/$/, "");
    const isAllowed = allowedOrigins.some(
      (o) => normalized === o.toLowerCase().replace(/\/$/, "")
    );

    if (isAllowed) callback(null, true);
    else callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Global rate limiting
app.use(apiLimiter);

// Request Logger
app.use(requestLogger);

// Static files
app.use("/api/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/dev/api/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =============================================================
// ROUTES — ALL BELOW CORS NOW ✔
// =============================================================

app.use("/api/linkedin", linkedinRoutes); // 👍 FIXED order

// Health Check
app.get(["/", "/dev"], async (req, res) => {
  await logger.info("system", "Health check endpoint accessed");
  res.json({
    message: "Y4D Backend API is running!",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Test DB (disabled in production)
app.get(["/api/test-db", "/dev/api/test-db"], async (req, res) => {
  if (isProduction()) {
    return res.status(404).json({ error: "Not found" });
  }
  try {
    const [results] = await db.query("SELECT 1 + 1 AS solution");
    await logger.success("system", "DB OK");
    res.json({
      message: "Database connection successful",
      solution: results[0].solution,
    });
  } catch (error) {
    await logger.error("system", "DB FAILED", error);
    res.status(500).json({
      error: "Database connection failed",
    });
  }
});

// API Routes
app.use("/api", apiRoutes);
app.use("/dev/api", apiRoutes);

// Swagger
if (!isProduction()) {
  app.use(["/api-docs", "/dev/api-docs"], swaggerUi.serve, (req, res, next) => {
    const apiBaseUrl = swaggerSpec.getApiBaseUrl(req);
    const dynamicSpec = {
      ...swaggerSpec,
      servers: [{ url: apiBaseUrl }],
    };
    swaggerUi.setup(dynamicSpec)(req, res, next);
  });
} else {
  app.get(["/api-docs", "/dev/api-docs"], (req, res) =>
    res.status(404).json({ error: "Not found" })
  );
}

// 404 Handler
app.use((req, res) => {
  logger.warning("api", `404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ error: "Route not found", path: req.url });
});

// Error Logger & Handler
app.use(errorLogger);
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// =============================================================
// SERVER START
// =============================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", async () => {
  consoleLogger.startup(`🚀 Server running on port ${PORT}`);
  await logger.createLog({
    level: logger.LogLevel.SUCCESS,
    type: logger.LogType.SYSTEM_START,
    message: `Server started`,
    metadata: { port: PORT },
  });
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  consoleLogger.startup("SIGTERM signal received: closing HTTP server");
  await logger.info("system", "Server shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", async () => {
  consoleLogger.startup("SIGINT signal received: closing HTTP server");
  await logger.info("system", "Server shutting down gracefully");
  process.exit(0);
});

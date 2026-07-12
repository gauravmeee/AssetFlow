require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");

const app = express();
const userRoutes = require("./routes/user.routes");
const aiRoutes = require("./routes/ai.routes");
const departmentRoutes = require("./routes/department.routes");
const categoryRoutes = require("./routes/category.routes");
const authRoutes = require("./routes/auth.routes");
const assetRoutes = require("./routes/assest.routes");
const allocationRoutes = require("./routes/allocation.routes");
const bookingRoutes = require("./routes/booking.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const logger = require("./utils/logger");
const requestLogger = require("./middleware/requestLogger");
const errorHandler = require("./middleware/errorHandler");

connectDB();
app.use(express.json());
app.use((req, res, next) => {
  const configuredOrigins = (
    process.env.CLIENT_ORIGIN || "http://localhost:5173,http://127.0.0.1:5173"
  )
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  const fallbackOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://0.0.0.0:5173",
  ];
  const allowedOrigins = [
    ...new Set([...configuredOrigins, ...fallbackOrigins]),
  ];
  const origin = req.headers.origin;

  const isAllowedOrigin = (candidate) => {
    if (!candidate) return false;

    if (allowedOrigins.includes(candidate)) return true;

    try {
      const { hostname, protocol, port } = new URL(candidate);
      return (
        ["localhost", "127.0.0.1", "0.0.0.0", "::1"].includes(hostname) &&
        ["http:", "https:"].includes(protocol)
      );
    } catch {
      return false;
    }
  };

  if (origin && isAllowedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  res.setHeader("Vary", "Origin");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});
app.use(requestLogger);

app.use("/", userRoutes);
app.use("/", aiRoutes);
app.use("/", departmentRoutes);
app.use("/", categoryRoutes);
app.use("/", assetRoutes);
app.use("/", allocationRoutes);
app.use("/", bookingRoutes);
app.use("/", dashboardRoutes);
app.use("/auth", authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
});

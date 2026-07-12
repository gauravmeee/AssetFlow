require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");

const app = express();
const userRoutes = require("./routes/user.routes");
const aiRoutes = require("./routes/ai.routes");
const departmentRoutes = require("./routes/department.routes");
const logger = require("./utils/logger");
const requestLogger = require("./middleware/requestLogger");
const errorHandler = require("./middleware/errorHandler");

connectDB();
app.use(express.json());
app.use(requestLogger);

app.use("/", userRoutes);
app.use("/", aiRoutes);
app.use("/", departmentRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
});

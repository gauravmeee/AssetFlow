const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const ApiError = require("../utils/apiError");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      throw ApiError.unauthorized("Authorization token is required");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "assetflow-dev-secret",
    );
    const user = await User.findById(decoded.id);

    if (!user || user.status !== "ACTIVE") {
      throw ApiError.unauthorized("Invalid or inactive user");
    }

    req.user = user;
    next();
  } catch (err) {
    next(ApiError.unauthorized("Invalid or expired token"));
  }
};

const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized("Authentication is required"));
    }

    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden("You do not have permission"));
    }

    next();
  };

module.exports = {
  authenticate,
  authorize,
};

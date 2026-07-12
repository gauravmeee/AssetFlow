const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const logger = require("../utils/logger");

const signToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || "assetflow-dev-secret",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
  );
};

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  department: user.department || null,
  phone: user.phone || null,
  status: user.status,
  createdAt: user.createdAt,
});

const signup = async (req, res, next) => {
  try {
    const { name, email, password, department, phone } = req.body;

    if (!name || !email || !password) {
      throw ApiError.badRequest("Name, email and password are required");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      throw ApiError.conflict("Email already exists");
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: "EMPLOYEE",
      department,
      phone,
      status: "ACTIVE",
    });

    const token = signToken(user);
    logger.info(`New user signed up: ${user.email}`);

    return res.status(201).json(
      ApiResponse(
        201,
        {
          user: sanitizeUser(user),
          token,
        },
        "Signup successful",
      ),
    );
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw ApiError.badRequest("Email and password are required");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password",
    );

    if (!user) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    if (user.status !== "ACTIVE") {
      throw ApiError.forbidden("Account is inactive");
    }

    const token = signToken(user);

    return res.status(200).json(
      ApiResponse(
        200,
        {
          user: sanitizeUser(user),
          token,
        },
        "Login successful",
      ),
    );
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      throw ApiError.badRequest("Email and new password are required");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      throw ApiError.notFound("No account found with that email");
    }

    user.password = newPassword;
    await user.save();

    logger.info(`Password reset successful for: ${user.email}`);

    return res
      .status(200)
      .json(ApiResponse(200, null, "Password reset successful"));
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const getCurrentUser = async (req, res, next) => {
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

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    return res
      .status(200)
      .json(ApiResponse(200, sanitizeUser(user), "User fetched successfully"));
  } catch (err) {
    logger.error(err);
    next(ApiError.unauthorized("Invalid or expired token"));
  }
};

module.exports = {
  signup,
  login,
  forgotPassword,
  getCurrentUser,
};

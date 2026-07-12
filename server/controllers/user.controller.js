const User = require("../models/user.model");
const logger = require("../utils/logger");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const getHome = (req, res) => {
  logger.info("Home route accessed");
  res.status(200).json(ApiResponse(200, null, "Backend is working"));
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    return res
      .status(200)
      .json(ApiResponse(200, user, "User fetched successfully"));
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, department, phone } = req.body;

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
      role: role || "EMPLOYEE",
      department,
      phone,
      status: "ACTIVE",
    });

    return res
      .status(201)
      .json(ApiResponse(201, user, "User created successfully"));
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

module.exports = {
  getHome,
  getUserById,
  createUser,
};

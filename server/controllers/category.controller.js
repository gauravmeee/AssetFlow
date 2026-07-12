const Category = require("../models/category.model");
const logger = require("../utils/logger");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const createCategory = async (req, res, next) => {
  try {
    const { name, description, status, createdBy, updatedBy } = req.body;

    if (!name || !createdBy) {
      throw ApiError.badRequest("Name and Created By are required");
    }

    const normalizedName = name.trim();

    const existingCategory = await Category.findOne({
      name: normalizedName,
    }).collation({ locale: "en", strength: 2 });

    if (existingCategory) {
      throw ApiError.conflict("Category already exists");
    }

    const lastCategory = await Category.findOne({ isDeleted: false })
      .sort({ createdAt: -1 })
      .select("code");

    let nextNumber = 1;

    if (lastCategory?.code) {
      const match = lastCategory.code.match(/\d+/);
      if (match) {
        nextNumber = Number(match[0]) + 1;
      }
    }

    const code = `CAT-${String(nextNumber).padStart(4, "0")}`;

    const category = await Category.create({
      name: normalizedName,
      code,
      description: description?.trim() || "",
      status: status || "ACTIVE",
      createdBy,
      updatedBy: updatedBy || createdBy,
    });

    logger.info(`Category created successfully: ${category._id}`);

    return res
      .status(201)
      .json(ApiResponse(201, category, "Category created successfully"));
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isDeleted: false }).sort({
      createdAt: -1,
    });

    return res
      .status(200)
      .json(ApiResponse(200, categories, "Categories fetched successfully"));
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!category) {
      throw ApiError.notFound("Category not found");
    }

    return res
      .status(200)
      .json(ApiResponse(200, category, "Category fetched successfully"));
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { name, description, status, updatedBy } = req.body;

    const category = await Category.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!category) {
      throw ApiError.notFound("Category not found");
    }

    if (name && name.trim() !== category.name) {
      const existingCategory = await Category.findOne({
        name: name.trim(),
        _id: { $ne: category._id },
      }).collation({ locale: "en", strength: 2 });

      if (existingCategory) {
        throw ApiError.conflict("Category already exists");
      }
    }

    if (name) category.name = name.trim();
    if (description !== undefined) category.description = description.trim();
    if (status) category.status = status;
    category.updatedBy = updatedBy || category.updatedBy;

    await category.save();

    return res
      .status(200)
      .json(ApiResponse(200, category, "Category updated successfully"));
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!category) {
      throw ApiError.notFound("Category not found");
    }

    category.isDeleted = true;
    category.deletedAt = new Date();
    category.status = "ARCHIVED";

    await category.save();

    return res
      .status(200)
      .json(ApiResponse(200, null, "Category deleted successfully"));
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};

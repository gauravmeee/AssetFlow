const Department = require("../models/department.model");
const logger = require("../utils/logger");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");

const createDepartment = async (req, res, next) => {
  try {
    const { name, description, manager, createdBy } = req.body;
    const actorId = req.user?._id || createdBy;

    if (!name || !actorId) {
      throw ApiError.badRequest("Name and Created By are required");
    }

    const existingDepartment = await Department.findOne({
      name: name.trim(),
    }).collation({ locale: "en", strength: 2 });

    if (existingDepartment) {
      throw ApiError.conflict("Department already exists");
    }

    const lastDepartment = await Department.findOne()
      .sort({ createdAt: -1 })
      .select("code");

    let nextNumber = 1;

    if (lastDepartment?.code) {
      const match = lastDepartment.code.match(/\d+/);

      if (match) {
        nextNumber = Number(match[0]) + 1;
      }
    }

    const code = `DEP-${String(nextNumber).padStart(4, "0")}`;

    logger.info(`Creating department: ${name}`);

    const department = await Department.create({
      name,
      code,
      description,
      manager,
      createdBy: actorId,
    });

    logger.info(`Department created successfully`);

    res
      .status(201)
      .json(ApiResponse(201, department, "Department created successfully"));
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find({ isDeleted: false })
      .populate("manager", "name email role")
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json(ApiResponse(200, departments, "Departments fetched successfully"));
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const updateDepartment = async (req, res, next) => {
  try {
    const { name, description, manager, status, updatedBy } = req.body;
    const actorId = req.user?._id || updatedBy;
    const department = await Department.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!department) {
      throw ApiError.notFound("Department not found");
    }

    if (name && name.trim() !== department.name) {
      const existingDepartment = await Department.findOne({
        name: name.trim(),
        _id: { $ne: department._id },
        isDeleted: false,
      }).collation({ locale: "en", strength: 2 });

      if (existingDepartment) {
        throw ApiError.conflict("Department already exists");
      }
    }

    if (name !== undefined) department.name = name.trim();
    if (description !== undefined) department.description = description.trim();
    if (manager !== undefined) department.manager = manager || null;
    if (status !== undefined) department.status = status;
    department.updatedBy = actorId || department.updatedBy;

    await department.save();

    return res
      .status(200)
      .json(ApiResponse(200, department, "Department updated successfully"));
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

module.exports = {
  createDepartment,
  getDepartments,
  updateDepartment,
};

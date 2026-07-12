const Department = require("../models/department.model");
const logger = require("../utils/logger");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const createDepartment = async (req, res, next) => {
  try {
    const { name, description, manager, createdBy } = req.body;

    if (!name || !createdBy) {
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
      createdBy,
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

module.exports = {
  createDepartment,
};

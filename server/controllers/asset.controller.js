const Asset = require("../models/asset.model");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const logger = require("../utils/logger");

const createAsset = async (req, res, next) => {
  try {
    const {
      name,
      category,
      department,
      location,
      serialNumber,
      acquisitionDate,
      acquisitionCost,
      condition,
      isShared,
      remarks,
      attachments,
    } = req.body;

    if (
      !name ||
      !category ||
      !department ||
      !location ||
      !acquisitionDate ||
      acquisitionCost === undefined
    ) {
      throw ApiError.badRequest("Missing required fields");
    }

    if (serialNumber) {
      const existingSerial = await Asset.findOne({
        serialNumber,
      });

      if (existingSerial) {
        throw ApiError.conflict("Serial Number already exists");
      }
    }

    const lastAsset = await Asset.findOne()
      .sort({ createdAt: -1 })
      .select("assetTag");

    let nextAssetNumber = 1;

    if (lastAsset?.assetTag) {
      const match = lastAsset.assetTag.match(/\d+/);

      if (match) nextAssetNumber = Number(match[0]) + 1;
    }

    const assetTag = `AF-${String(nextAssetNumber).padStart(4, "0")}`;

    const asset = await Asset.create({
      assetTag,
      name,
      category,
      department,
      location,
      serialNumber,
      acquisitionDate,
      acquisitionCost,
      condition,
      isShared,
      remarks,
      attachments,
      createdBy: req.user._id,
    });

    return res
      .status(201)
      .json(ApiResponse(201, asset, "Asset created successfully"));
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const getAssets = async (req, res, next) => {
  try {
    const assets = await Asset.find({
      isDeleted: false,
    })
      .populate("category")
      .populate("department");

    res.json(ApiResponse(200, assets));
  } catch (err) {
    next(err);
  }
};

const getAssetById = async (req, res, next) => {
  try {
    const asset = await Asset.findById(req.params.id)
      .populate("category")
      .populate("department");

    if (!asset) {
      throw ApiError.notFound("Asset not found");
    }

    res.json(ApiResponse(200, asset));
  } catch (err) {
    next(err);
  }
};

const updateAsset = async (req, res, next) => {
  try {
    const asset = await Asset.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedBy: req.user._id,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!asset) {
      throw ApiError.notFound("Asset not found");
    }

    res.json(ApiResponse(200, asset, "Asset updated successfully"));
  } catch (err) {
    next(err);
  }
};

const deleteAsset = async (req, res, next) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      throw ApiError.notFound("Asset not found");
    }

    asset.isDeleted = true;
    asset.deletedAt = new Date();

    await asset.save();

    res.json(ApiResponse(200, null, "Asset deleted successfully"));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createAsset,
  getAssets,
  getAssetById,
  updateAsset,
  deleteAsset,
};

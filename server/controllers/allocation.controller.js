const Allocation = require("../models/allocation.model");
const Asset = require("../models/asset.model");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");

const populateAllocation = (query) =>
  query
    .populate("asset", "assetTag name status location")
    .populate("assignedTo", "name email")
    .populate("department", "name code")
    .populate("createdBy", "name email");

const getAllocations = async (req, res, next) => {
  try {
    const allocations = await populateAllocation(
      Allocation.find().sort({ createdAt: -1 }),
    );

    return res
      .status(200)
      .json(ApiResponse(200, allocations, "Allocations fetched successfully"));
  } catch (err) {
    next(err);
  }
};

const createAllocation = async (req, res, next) => {
  try {
    const { asset, assignedTo, department, expectedReturnDate } = req.body;

    if (!asset || (!assignedTo && !department)) {
      throw ApiError.badRequest(
        "Asset and either employee or department are required",
      );
    }

    const assetDoc = await Asset.findById(asset).populate(
      "currentHolder",
      "name email",
    );

    if (!assetDoc) {
      throw ApiError.notFound("Asset not found");
    }

    if (assetDoc.status === "ALLOCATED") {
      const holder = assetDoc.currentHolder?.name || "another holder";
      throw ApiError.conflict(`Asset is already held by ${holder}`);
    }

    if (["UNDER_MAINTENANCE", "LOST", "RETIRED", "DISPOSED"].includes(assetDoc.status)) {
      throw ApiError.conflict(`Asset cannot be allocated while ${assetDoc.status}`);
    }

    const allocation = await Allocation.create({
      asset,
      assignedTo: assignedTo || null,
      department: department || null,
      expectedReturnDate: expectedReturnDate || null,
      createdBy: req.user._id,
    });

    assetDoc.status = "ALLOCATED";
    assetDoc.currentHolder = assignedTo || null;
    if (department) assetDoc.department = department;
    assetDoc.updatedBy = req.user._id;
    await assetDoc.save();

    const populated = await populateAllocation(
      Allocation.findById(allocation._id),
    );

    return res
      .status(201)
      .json(ApiResponse(201, populated, "Asset allocated successfully"));
  } catch (err) {
    next(err);
  }
};

const transferAllocation = async (req, res, next) => {
  try {
    const { assignedTo, department, expectedReturnDate } = req.body;
    const allocation = await Allocation.findById(req.params.id);

    if (!allocation || allocation.status !== "ACTIVE") {
      throw ApiError.notFound("Active allocation not found");
    }

    allocation.status = "TRANSFERRED";
    allocation.returnedAt = new Date();
    await allocation.save();

    const nextAllocation = await Allocation.create({
      asset: allocation.asset,
      assignedTo: assignedTo || null,
      department: department || null,
      expectedReturnDate: expectedReturnDate || null,
      createdBy: req.user._id,
    });

    await Asset.findByIdAndUpdate(allocation.asset, {
      currentHolder: assignedTo || null,
      ...(department ? { department } : {}),
      status: "ALLOCATED",
      updatedBy: req.user._id,
    });

    const populated = await populateAllocation(
      Allocation.findById(nextAllocation._id),
    );

    return res
      .status(200)
      .json(ApiResponse(200, populated, "Allocation transferred successfully"));
  } catch (err) {
    next(err);
  }
};

const returnAllocation = async (req, res, next) => {
  try {
    const { checkInNotes } = req.body;
    const allocation = await Allocation.findById(req.params.id);

    if (!allocation || allocation.status !== "ACTIVE") {
      throw ApiError.notFound("Active allocation not found");
    }

    allocation.status = "RETURNED";
    allocation.returnedAt = new Date();
    allocation.checkInNotes = checkInNotes || "";
    await allocation.save();

    await Asset.findByIdAndUpdate(allocation.asset, {
      currentHolder: null,
      status: "AVAILABLE",
      updatedBy: req.user._id,
    });

    const populated = await populateAllocation(Allocation.findById(allocation._id));

    return res
      .status(200)
      .json(ApiResponse(200, populated, "Asset returned successfully"));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllocations,
  createAllocation,
  transferAllocation,
  returnAllocation,
};

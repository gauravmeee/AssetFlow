const Asset = require("../models/asset.model");
const Allocation = require("../models/allocation.model");
const Booking = require("../models/booking.model");
const Department = require("../models/department.model");
const Category = require("../models/category.model");
const ApiResponse = require("../utils/apiResponse");

const getDashboardSummary = async (req, res, next) => {
  try {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const [
      assetsAvailable,
      assetsAllocated,
      underMaintenance,
      activeBookings,
      overdueAllocations,
      upcomingReturns,
      departmentCount,
      categoryCount,
    ] = await Promise.all([
      Asset.countDocuments({ status: "AVAILABLE" }),
      Asset.countDocuments({ status: "ALLOCATED" }),
      Asset.countDocuments({ status: "UNDER_MAINTENANCE" }),
      Booking.countDocuments({
        status: { $in: ["UPCOMING", "ONGOING"] },
        startTime: { $lt: todayEnd },
        endTime: { $gt: todayStart },
      }),
      Allocation.countDocuments({
        status: "ACTIVE",
        expectedReturnDate: { $lt: now },
      }),
      Allocation.countDocuments({
        status: "ACTIVE",
        expectedReturnDate: { $gte: now },
      }),
      Department.countDocuments({ isDeleted: false }),
      Category.countDocuments({ isDeleted: false }),
    ]);

    return res.status(200).json(
      ApiResponse(
        200,
        {
          assetsAvailable,
          assetsAllocated,
          underMaintenance,
          activeBookings,
          overdueAllocations,
          upcomingReturns,
          departmentCount,
          categoryCount,
        },
        "Dashboard summary fetched successfully",
      ),
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboardSummary,
};

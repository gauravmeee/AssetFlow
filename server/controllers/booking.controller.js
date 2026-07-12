const Asset = require("../models/asset.model");
const Booking = require("../models/booking.model");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");

const populateBooking = (query) =>
  query
    .populate("resource", "assetTag name location status isShared")
    .populate("bookedBy", "name email");

const getBookings = async (req, res, next) => {
  try {
    const bookings = await populateBooking(
      Booking.find().sort({ startTime: 1 }),
    );

    return res
      .status(200)
      .json(ApiResponse(200, bookings, "Bookings fetched successfully"));
  } catch (err) {
    next(err);
  }
};

const createBooking = async (req, res, next) => {
  try {
    const { resource, title, startTime, endTime, notes } = req.body;

    if (!resource || !startTime || !endTime) {
      throw ApiError.badRequest("Resource, start time and end time are required");
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
      throw ApiError.badRequest("Booking end time must be after start time");
    }

    const asset = await Asset.findById(resource);

    if (!asset) {
      throw ApiError.notFound("Resource not found");
    }

    if (!asset.isShared) {
      throw ApiError.conflict("Only shared/bookable assets can be booked");
    }

    const overlap = await Booking.findOne({
      resource,
      status: { $ne: "CANCELLED" },
      startTime: { $lt: end },
      endTime: { $gt: start },
    }).populate("bookedBy", "name email");

    if (overlap) {
      throw ApiError.conflict(
        `Resource is already booked by ${overlap.bookedBy?.name || "another user"} for that slot`,
      );
    }

    const booking = await Booking.create({
      resource,
      bookedBy: req.user._id,
      title,
      startTime: start,
      endTime: end,
      notes,
    });

    const populated = await populateBooking(Booking.findById(booking._id));

    return res
      .status(201)
      .json(ApiResponse(201, populated, "Booking created successfully"));
  } catch (err) {
    next(err);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "CANCELLED" },
      { new: true },
    );

    if (!booking) {
      throw ApiError.notFound("Booking not found");
    }

    const populated = await populateBooking(Booking.findById(booking._id));

    return res
      .status(200)
      .json(ApiResponse(200, populated, "Booking cancelled successfully"));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBookings,
  createBooking,
  cancelBooking,
};

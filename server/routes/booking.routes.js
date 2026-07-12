const express = require("express");
const {
  cancelBooking,
  createBooking,
  getBookings,
} = require("../controllers/booking.controller");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.get("/bookings", authenticate, getBookings);
router.post("/bookings", authenticate, createBooking);
router.patch("/bookings/:id/cancel", authenticate, cancelBooking);

module.exports = router;

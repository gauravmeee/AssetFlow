const express = require("express");
const {
  createAllocation,
  getAllocations,
  returnAllocation,
  transferAllocation,
} = require("../controllers/allocation.controller");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.get("/allocations", authenticate, getAllocations);
router.post("/allocations", authenticate, createAllocation);
router.patch("/allocations/:id/transfer", authenticate, transferAllocation);
router.patch("/allocations/:id/return", authenticate, returnAllocation);

module.exports = router;

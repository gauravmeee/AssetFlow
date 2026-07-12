const express = require("express");
const { getDashboardSummary } = require("../controllers/dashboard.controller");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.get("/dashboard/summary", authenticate, getDashboardSummary);

module.exports = router;

const express = require("express");
const router = express.Router();

const {
  createDepartment,
  getDepartments,
  updateDepartment,
} = require("../controllers/department.controller");
const { authenticate, authorize } = require("../middleware/auth");

router.post("/departments", authenticate, authorize("ADMIN"), createDepartment);
router.get("/departments", authenticate, getDepartments);
router.patch(
  "/departments/:id",
  authenticate,
  authorize("ADMIN"),
  updateDepartment,
);

module.exports = router;

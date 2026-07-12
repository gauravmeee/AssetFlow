const express = require("express");
const router = express.Router();

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");
const { authenticate, authorize } = require("../middleware/auth");

router.post("/categories", authenticate, authorize("ADMIN"), createCategory);
router.get("/categories", authenticate, getCategories);
router.get("/categories/:id", authenticate, getCategoryById);
router.put("/categories/:id", authenticate, authorize("ADMIN"), updateCategory);
router.delete(
  "/categories/:id",
  authenticate,
  authorize("ADMIN"),
  deleteCategory,
);

module.exports = router;

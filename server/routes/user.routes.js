const express = require("express");
const router = express.Router();

const {
  getHome,
  getUsers,
  getUserById,
  createUser,
  updateUser,
} = require("../controllers/user.controller");
const { authenticate, authorize } = require("../middleware/auth");

router.get("/", getHome);

router.get("/users", authenticate, getUsers);

router.get("/users/:id", authenticate, getUserById);

router.post("/users", authenticate, authorize("ADMIN"), createUser);

router.patch("/users/:id", authenticate, authorize("ADMIN"), updateUser);

module.exports = router;

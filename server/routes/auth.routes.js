const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  forgotPassword,
  getCurrentUser,
} = require("../controllers/auth.controller");

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.get("/me", getCurrentUser);

module.exports = router;

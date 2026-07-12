const express = require("express");
const router = express.Router();

const { createDepartment } = require("../controllers/department.controller");

router.post("/departments", createDepartment);

module.exports = router;

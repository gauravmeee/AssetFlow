const express = require("express");

const router = express.Router();

const {
  createAsset,
  getAssets,
  getAssetById,
  updateAsset,
  deleteAsset,
} = require("../controllers/asset.controller");
const { authenticate } = require("../middleware/auth");

router.post("/assets", authenticate, createAsset);

router.get("/assets", getAssets);

router.get("/assets/:id", getAssetById);

router.put("/assets/:id", authenticate, updateAsset);

router.delete("/assets/:id", authenticate, deleteAsset);

module.exports = router;

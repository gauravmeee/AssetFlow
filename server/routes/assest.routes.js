const express = require("express");

const router = express.Router();

const {
  createAsset,
  getAssets,
  getAssetById,
  updateAsset,
  deleteAsset,
} = require("../controllers/asset.controller");

router.post("/assets", createAsset);

router.get("/assets", getAssets);

router.get("/assets/:id", getAssetById);

router.put("/assets/:id", updateAsset);

router.delete("/assets/:id", deleteAsset);

module.exports = router;

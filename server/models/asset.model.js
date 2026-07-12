const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
  {
    assetTag: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    serialNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    acquisitionDate: {
      type: Date,
      required: true,
    },

    acquisitionCost: {
      type: Number,
      required: true,
      min: 0,
    },

    currentHolder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    condition: {
      type: String,
      enum: ["NEW", "GOOD", "FAIR", "DAMAGED", "SCRAP"],
      default: "NEW",
    },

    status: {
      type: String,
      enum: [
        "AVAILABLE",
        "ALLOCATED",
        "RESERVED",
        "UNDER_MAINTENANCE",
        "LOST",
        "RETIRED",
        "DISPOSED",
      ],
      default: "AVAILABLE",
      index: true,
    },

    photos: [
      {
        type: String,
      },
    ],

    remarks: {
      type: String,
      trim: true,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },

    deletedAt: {
      type: Date,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

assetSchema.index({ assetTag: 1 }, { unique: true });
assetSchema.index({ serialNumber: 1 }, { unique: true, sparse: true });
assetSchema.index({ category: 1 });
assetSchema.index({ department: 1 });
assetSchema.index({ currentHolder: 1 });
assetSchema.index({ status: 1 });

module.exports = mongoose.model("Asset", assetSchema);

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
      index: true,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      index: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
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

    // Keep this only if you want quick lookup.
    // Actual allocation history should be maintained
    // in Allocation collection.
    currentHolder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
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

    isShared: {
      type: Boolean,
      default: false,
    },

    attachments: [
      {
        type: String,
        trim: true,
      },
    ],

    remarks: {
      type: String,
      trim: true,
      default: "",
      maxlength: 500,
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
      index: true,
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

// Text Search
assetSchema.index({
  name: "text",
  assetTag: "text",
  serialNumber: "text",
});

// Common Query Indexes
assetSchema.index({ category: 1, status: 1 });
assetSchema.index({ department: 1, status: 1 });
assetSchema.index({ currentHolder: 1, status: 1 });

// Ignore soft deleted assets
assetSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: false });
  next();
});

module.exports = mongoose.model("Asset", assetSchema);

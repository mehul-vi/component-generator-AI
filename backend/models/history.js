const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    // Clerk user ID
    userId: {
      type: String,
      required: true,
      index: true,
    },

    // User prompt
    prompt: {
      type: String,
      required: true,
      trim: true,
    },

    // Selected framework
    framework: {
      type: String,
      required: true,
    },

    // Generated HTML code
    code: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt automatically add karega
  }
);

// Optional: recent first sorting helper
historySchema.index({ createdAt: -1 });

module.exports = mongoose.model("History", historySchema);
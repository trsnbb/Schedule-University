import mongoose from "mongoose";

const dbChangeLogSchema = new mongoose.Schema(
  {
    collection: { type: String, required: true },
    operation: { type: String, required: true },
    short: String,
    full: String,
    documentId: mongoose.Schema.Types.Mixed,
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("DbChangeLog", dbChangeLogSchema);

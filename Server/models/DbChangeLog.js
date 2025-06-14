// models/DbChangeLog.js
import mongoose from "mongoose";

const dbChangeLogSchema = new mongoose.Schema(
  {
    collection: { type: String, required: true },
    operation: { type: String, required: true }, // insert, update, delete
    short: String,
    full: String,
    documentId: mongoose.Schema.Types.Mixed, // Може бути ObjectId або інший тип
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("DbChangeLog", dbChangeLogSchema);

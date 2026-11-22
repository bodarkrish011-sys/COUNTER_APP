// One History record is created for every button click.
import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, enum: ["increase", "decrease", "reset"], required: true },
  value: { type: Number, required: true }, // counter value AFTER the action
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("History", historySchema);

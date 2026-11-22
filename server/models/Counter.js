// Each user has exactly one counter. "user" links it to the owner.
import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  value: { type: Number, default: 0 },
});

export default mongoose.model("Counter", counterSchema);

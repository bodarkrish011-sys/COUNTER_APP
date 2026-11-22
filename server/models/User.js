// A "model" describes what one record looks like in MongoDB.
// This one describes a user account.
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  // unique: true means two users cannot share the same email
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }, // stored hashed, never as plain text
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);

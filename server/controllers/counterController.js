// Logic for the counter. Every function only touches the logged-in user's data
// (req.user comes from the auth middleware).
import Counter from "../models/Counter.js";
import History from "../models/History.js";

// GET /api/counter -> current value (0 if the user has never clicked)
export const getCounter = async (req, res) => {
  try {
    const counter = await Counter.findOne({ user: req.user._id });
    res.json({ value: counter ? counter.value : 0 });
  } catch (error) {
    res.status(500).json({ message: "Server error, please try again" });
  }
};

// Shared helper: update the counter, then save a history record.
// upsert: true = create the counter automatically the first time.
const saveAction = async (req, res, action, update) => {
  try {
    const counter = await Counter.findOneAndUpdate({ user: req.user._id }, update, {
      new: true, // give us the updated counter
      upsert: true,
    });
    const entry = await History.create({
      user: req.user._id,
      action,
      value: counter.value,
    });
    res.json({ value: counter.value, entry });
  } catch (error) {
    res.status(500).json({ message: "Server error, please try again" });
  }
};

export const increase = (req, res) => saveAction(req, res, "increase", { $inc: { value: 1 } });
export const decrease = (req, res) => saveAction(req, res, "decrease", { $inc: { value: -1 } });
export const reset = (req, res) => saveAction(req, res, "reset", { $set: { value: 0 } });

// GET /api/counter/history -> this user's history, newest first
export const getHistory = async (req, res) => {
  try {
    const history = await History.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Server error, please try again" });
  }
};

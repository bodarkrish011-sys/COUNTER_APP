// Controllers hold the real logic: what happens when a route is called.
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// A token is like a ticket. The user shows it on every request to prove who they are.
const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// Send back the token plus safe user info (never the password).
const sendAuthResponse = (res, status, user) =>
  res.status(status).json({
    token: createToken(user._id),
    user: { id: user._id, name: user.name, email: user.email },
  });

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(409).json({ message: "This email is already registered" });
    }

    // Hash the password: turn it into scrambled text that cannot be reversed.
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: cleanEmail, password: hashedPassword });

    sendAuthResponse(res, 201, user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "This email is already registered" });
    }
    res.status(500).json({ message: "Server error, please try again" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter your email and password" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    // Compare the typed password with the hashed one in the database.
    const passwordMatches = user && (await bcrypt.compare(password, user.password));
    if (!passwordMatches) {
      return res.status(401).json({ message: "Wrong email or password" });
    }

    sendAuthResponse(res, 200, user);
  } catch (error) {
    res.status(500).json({ message: "Server error, please try again" });
  }
};

// Middleware runs BEFORE a controller. This one is a security guard:
// no valid token = no entry.
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  const header = req.headers.authorization; // looks like: "Bearer eyJhbGci..."

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Please log in first" });
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // throws if fake or expired
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }
    req.user = user; // controllers can now use req.user
    next(); // let the request continue
  } catch (error) {
    res.status(401).json({ message: "Session expired, please log in again" });
  }
};

// The entry point: starts the whole backend.
import "dotenv/config"; // loads values from the .env file
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import counterRoutes from "./routes/counterRoutes.js";

const app = express();

app.use(cors()); // allow the React app (another port) to call this server
app.use(express.json()); // understand JSON sent in request bodies

app.use("/api/auth", authRoutes);
app.use("/api/counter", counterRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});

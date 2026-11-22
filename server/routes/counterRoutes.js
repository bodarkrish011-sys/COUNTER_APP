import express from "express";
import { getCounter, increase, decrease, reset, getHistory } from "../controllers/counterController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // every route below needs a valid token

router.get("/", getCounter);
router.get("/history", getHistory);
router.post("/increase", increase);
router.post("/decrease", decrease);
router.post("/reset", reset);

export default router;

import express from "express";
import {
    createTrade, getAllTrades, getSingleTrade,
    updateTrade,
    deleteTrade,
    getTradeSummary,
    getPieData,
    getTimelineData
} from "../controllers/trade-controller.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create a new trade (Protected)
router.post("/", protect, createTrade);

// Get all trades of the logged-in user (Protected)
router.get("/", protect, getAllTrades);
router.get("/summary", protect, getTradeSummary);
router.get("/pie", protect, getPieData);
router.get("/timeline", protect, getTimelineData);
// Get a single trade by ID (Protected)
router.get("/:id", protect, getSingleTrade);
router.put("/update/:id", protect, updateTrade);
router.delete("/delete/:id", protect, deleteTrade);


export default router;

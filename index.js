import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import tradeRoutes from "./routes/trade-routes.js";
import authRoutes from "./routes/auth.js";

// Load env variables
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware

app.use(cors({
  origin: "http://localhost:5173",  // ✅ your frontend URL
}));

app.use(express.json());

// Sample route
app.get("/", (req, res) => {
  res.send("TradeBook Backend Running ✅");
});
//connect routes
app.use("/api/auth", authRoutes); 
// So your full route becomes:
// /api/auth/register
// /api/auth/login

app.use("/api/trades", tradeRoutes);
// So your full route becomes:
// /api/trades/ (for creating a trade)  
// /api/trades/ (for getting all trades of the logged-in user)


// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.log("MongoDB Connection Failed ❌", err));


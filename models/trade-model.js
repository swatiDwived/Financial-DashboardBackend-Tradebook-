import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Relates trade to a user
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Buy", "Sell"],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  profitLoss: {
    type: Number,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  notes: {
    type: String,
    default: "",
  },
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

const Trade = mongoose.model("Trade", tradeSchema);

export default Trade;

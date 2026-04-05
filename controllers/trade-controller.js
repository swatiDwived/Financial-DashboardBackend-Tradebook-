import Trade from "../models/trade-model.js";
// Import the Trade model to interact with the trades collection in the database

// desc - create a new trade
// route - POST /api/trades
//access - Private (user must be authenticated using JWT middleware).


export const createTrade = async (req, res) => {
    try {
        const { symbol, type, date, profitLoss, tags, notes } = req.body;
        const newTrade = new Trade({
            userId: req.userId, // userId is set from the protect middleware
            symbol,
            type,
            date,
            profitLoss,
            tags,
            notes
        });
        const savedTrade = await newTrade.save();
        res.status(201).json({
            success: true,
            message: "Trade created successfully",
            trade: savedTrade
        });
    } catch (err) {
        console.log("Error creating trade:", err);
        res.status(500).json({
            success: false,
            message: "Failed to add trade",
        });
    }
};

// desc - get all trades for a user
// route - GET /api/trades
// access - Private (user must be authenticated using JWT middleware).


// GET /api/trades?month=7&year=2025 (optional query)

export const getAllTrades = async (req, res) => {
    try {
        const { month, year } = req.query;

        const filter = { userId: req.userId };

        if (month && year) {
            const startOfMonth = new Date(year, month - 1, 1);
            const endOfMonth = new Date(year, month, 0);
            filter.date = { $gte: startOfMonth, $lte: endOfMonth };
        } else {
            // Default to current month if no query passed
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            filter.date = { $gte: startOfMonth, $lte: endOfMonth };
        }

        const trades = await Trade.find(filter).sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: trades.length,
            trades,
        });
    } catch (err) {
        console.log("Error fetching trades:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch trades",
        });
    }
};

// desc - get a single trade by ID
// route - GET /api/trades/:id
// access - Private (user must be authenticated using JWT middleware).


export const getSingleTrade = async (req, res) => {
    try {
        const { id } = req.params; // Validate the ID format before proceeding
        const trade = await Trade.findOne({ _id: id, userId: req.userId });
        if (!trade) {
            return res.status(404).json({
                success: false,
                message: "Trade not found or unauthorized access",
            });
        }
        res.status(200).json({
            success: true,
            trade,
        });
    } catch (err) {
        console.log("Error fetching single trade:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch trade",
        });
    }
};

// desc - update a trade by ID
// route - PUT /api/trades/:id
// access - Private (user must be authenticated using JWT middleware).


export const updateTrade = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body; // Get the updated fields from the request body
        const updatedTrade = await Trade.findOneAndUpdate(
            { _id: id, userId: req.userId }, // Ensure the trade belongs to the user
            updates,
            { new: true } // Return the updated document
        );
        if (!updatedTrade) {
            return res.status(404).json({
                success: false,
                message: "Trade not found or unauthorized",
            });
        }
        res.status(200).json({
            success: true,
            message: "Trade updated successfully",
            trade: updatedTrade,
        });
    } catch (err) {
        console.log("Error updating trade:", err);
        res.status(500).json({
            success: false,
            message: "Failed to update trade",
        });
    }
};

// desc - delete a trade by ID
// route - DELETE /api/trades/:id
// access - Private (user must be authenticated using JWT middleware).


export const deleteTrade = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTrade = await Trade.findOneAndDelete({ _id: id, userId: req.userId });
        if (!deletedTrade) {
            return res.status(404).json({
                success: false,
                message: "Trade not found or unauthorized",
            });
        }
        res.status(200).json({
            success: true,
            message: "Trade deleted successfully",
        });
    } catch (err) {
        console.log("Error deleting trade:", err);
        res.status(500).json({
            success: false,
            message: "Failed to delete trade",
        });
    }
};

// desc - Get summary of trades for current/selected month
// route - GET /api/trades/summary?month=7&year=2025
// access - Private (user must be authenticated using JWT middleware).

export const getTradeSummary = async (req, res) => {
    try {
        const userId = req.userId; // userId is set from the protect middleware

        // Get month and year from query parameters
        const selectedMonth = parseInt(req.query.month); // e.g., 7 for July
        const selectedYear = parseInt(req.query.year); // e.g., 2025
        const now = new Date(); // Get current date for default values

        const month = isNaN(selectedMonth) ? now.getMonth() + 1 : selectedMonth; // Default to current month if not provided
        const year = isNaN(selectedYear) ? now.getFullYear() : selectedYear; // Default to current year if not provided

        //................Expression	Meaning...........
        // isNaN(selectedMonth)	Checks if month query is missing or invalid
        // now.getMonth() + 1	Gets current month (1–12) if month query is not provided or provided as invalid
        // isNaN(selectedYear)	Checks if year query is missing or invalid
        // now.getFullYear()	Gets current full year (like 2025) if year query is not provided or provided as invalid
        const startOfMonth = new Date(year, month - 1, 1); // Month - 1, Day = 1
        const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999); // Day = 0 gives last day of previous month (i.e., the month we want)

        const trades = await Trade.find({
            userId,
            date: {
                $gte: startOfMonth,
                $lte: endOfMonth
            }
        });
        const totalTrades = trades.length;
        const profitableTrades = trades.filter(t => t.profitLoss > 0).length;
        const successRate = totalTrades === 0 ? 0 : Math.round((profitableTrades / totalTrades) * 100);
        const netProfitLoss = trades.reduce((sum, trade) => sum + trade.profitLoss, 0);
        // "Go through every trade in the array and keep adding its profitLoss to the total, starting from 0."

        res.status(200).json({
            success: true,
            month,
            year,
            totalTrades,
            profitableTrades,
            netProfitLoss,
            successRate,
            message: "Trade summary fetched successfully"
        });
    } catch (err) {
        console.log("Error fetching trade summary:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch trade summary",
        });
    }
};

// desc    - Get profit vs loss percentage for current/selected month (for pie chart display)
// route   - GET /api/trades/pie?month=7&year=2025
// access  - Private (user must be authenticated using JWT middleware)

export const getPieData = async (req, res) => {
  try {
    const userId = req.userId;

    // Get month and year from query params or fallback to current
    const selectedMonth = parseInt(req.query.month);
    const selectedYear = parseInt(req.query.year);
    const now = new Date();

    const month = isNaN(selectedMonth) ? now.getMonth() + 1 : selectedMonth;
    const year = isNaN(selectedYear) ? now.getFullYear() : selectedYear;

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    const trades = await Trade.find({
      userId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    //  Value-based logic (sum of ₹ amounts)
    const profitSum = trades
      .filter(trade => trade.profitLoss > 0)
      .reduce((acc, trade) => acc + trade.profitLoss, 0);

    const lossSum = trades
      .filter(trade => trade.profitLoss < 0)
      .reduce((acc, trade) => acc + Math.abs(trade.profitLoss), 0); // Take absolute value

    const total = profitSum + lossSum;

    const profitPercentage = total === 0 ? 0 : Math.round((profitSum / total) * 100);
    const lossPercentage = total === 0 ? 0 : Math.round((lossSum / total) * 100);

    res.status(200).json({
      success: true,
      month,
      year,
      profitValue: profitSum,
      lossValue: lossSum,
      profitPercentage,
      lossPercentage,
      message: "Pie data (value-based) fetched successfully"
    });
  } catch (err) {
    console.log("Error fetching pie data:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pie data",
    });
  }
};


// desc    - Get monthly profit/loss summary for a given year (for timeline chart)
// route   - GET /api/trades/timeline?year=2025
// access  - Private (user must be authenticated using JWT middleware)
export const getTimelineData = async (req, res) => {
    try {
        const userId = req.userId;
        const { year } = req.query;

        if (!year) {
            return res.status(400).json({ message: "Year query is required" });
        }

        // Define date range for the given year
        const start = new Date(year, 0, 1);   // Jan 1, YYYY
        const end = new Date(year, 11, 31);   // Dec 31, YYYY

        // Fetch trades for this year only
        const trades = await Trade.find({
            userId,
            date: { $gte: start, $lte: end }
        });

        // Month order map (Jan → Dec)
        const monthOrder = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        // Initialize timeline with all months = 0
        const timeline = {};
        monthOrder.forEach(month => {
            timeline[month] = {
                totalProfit: 0,
                totalLoss: 0,
                totalTrades: 0,
            };
        });

        // Fill in actual trade data
        trades.forEach(trade => {
            const date = new Date(trade.date);
            const month = date.toLocaleString('default', { month: 'long' }); // e.g., "July"
            const profitLoss = Number(trade.profitLoss);

            timeline[month].totalTrades += 1;

            if (profitLoss > 0) {
                timeline[month].totalProfit += profitLoss;
            } else {
                timeline[month].totalLoss += Math.abs(profitLoss); // store as positive
            }
        });

        // Convert grouped data to array (Jan → Dec order)
        const formattedTimeline = monthOrder.map(month => ({
            month,
            totalProfit: timeline[month].totalProfit,
            totalLoss: timeline[month].totalLoss,
            totalTrades: timeline[month].totalTrades,
        }));

        res.status(200).json(formattedTimeline);
    } catch (err) {
        console.error("Error fetching timeline data:", err);
        res.status(500).json({
            message: "Something went wrong while fetching timeline data",
        });
    }
};

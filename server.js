const express = require("express");
const cors = require("cors");
require("dotenv").config();
const aiRoutes = require("./routes/aiRoutes");

const app = express();

// Get frontend URL from env variable (Vercel)
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Allow requests from localhost AND your deployed frontend
app.use(cors({ origin: [FRONTEND_URL, "http://localhost:3000", "http://localhost:3001"] }));

app.use(express.json());

// Health check
app.get("/", (req, res) => res.json({ status: "ok", message: "Converge AI backend running" }));

// Routes
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
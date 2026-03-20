const express = require("express");
const cors = require("cors");
require("dotenv").config();
const aiRoutes = require("./routes/aiRoutes");

const app = express();

// Allow all Vercel deployments + localhost dev
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://ai-frontend-ruddy.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean); // removes undefined if FRONTEND_URL not set

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, curl, mobile apps)
    if (!origin) return callback(null, true);
    // Allow any vercel.app subdomain automatically
    if (origin.endsWith(".vercel.app") || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS: " + origin));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Handle preflight requests for all routes
app.options("*", cors());

app.use(express.json());

// Health check — visit your backend URL to confirm it's live
app.get("/", (req, res) => res.json({ 
  status: "ok", 
  message: "Converge AI backend running",
  env: process.env.NODE_ENV || "development"
}));

app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
const axios = require("axios");

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const call = async (model, body) => {
  // This will show in your Vercel backend logs
  console.log("API Key present:", !!OPENROUTER_API_KEY);
  console.log("API Key prefix:", OPENROUTER_API_KEY?.slice(0, 10));
  console.log("Model:", model);

  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not set in environment variables");
  }

  const messages = body.messages || [{ role: "user", content: body.message }];

  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    { model, messages },
    {
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.FRONTEND_URL || "http://localhost:3000",
        "X-Title": "Converge AI",
      },
      timeout: 55000, // 55 seconds — just under Vercel's 60s limit
    }
  );

  return response.data;
};

const askAI = async (req, res) => {
  try {
    const data = await call(req.body.model || "meta-llama/llama-3-8b-instruct", req.body);
    res.json(data);
  } catch (error) {
    console.error("askAI error:", JSON.stringify(error.response?.data || error.message));
    res.status(500).json(error.response?.data || { error: error.message });
  }
};

const chatgpt = async (req, res) => {
  try {
    const data = await call(req.body.model || "openai/gpt-3.5-turbo", req.body);
    res.json(data);
  } catch (error) {
    console.error("chatgpt error:", JSON.stringify(error.response?.data || error.message));
    res.status(500).json(error.response?.data || { error: error.message });
  }
};

const claude = async (req, res) => {
  try {
    const data = await call(req.body.model || "anthropic/claude-3-haiku", req.body);
    res.json(data);
  } catch (error) {
    console.error("claude error:", JSON.stringify(error.response?.data || error.message));
    res.status(500).json(error.response?.data || { error: error.message });
  }
};

module.exports = { askAI, chatgpt, claude }
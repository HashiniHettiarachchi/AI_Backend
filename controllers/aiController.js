const axios = require("axios");

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Core helper — uses "messages" array if sent, falls back to single "message"
const call = async (model, body) => {
  const messages = body.messages || [{ role: "user", content: body.message }];
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    { model, messages },
    {
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Converge AI",
      },
    }
  );
  return response.data;
};

const askAI = async (req, res) => {
  try {
    const data = await call(req.body.model || "meta-llama/llama-3-8b-instruct", req.body);
    res.json(data);
  } catch (error) {
    console.error("askAI:", error.response?.data || error.message);
    res.status(500).json(error.response?.data || { error: "Error calling AI" });
  }
};

const chatgpt = async (req, res) => {
  try {
    const data = await call(req.body.model || "openai/gpt-3.5-turbo", req.body);
    res.json(data);
  } catch (error) {
    console.error("chatgpt:", error.response?.data || error.message);
    res.status(500).json(error.response?.data || { error: "Error calling AI" });
  }
};

const claude = async (req, res) => {
  try {
    const data = await call(req.body.model || "anthropic/claude-3-haiku", req.body);
    res.json(data);
  } catch (error) {
    console.error("claude:", error.response?.data || error.message);
    res.status(500).json(error.response?.data || { error: "Error calling AI" });
  }
};

module.exports = { askAI, chatgpt, claude };

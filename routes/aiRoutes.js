const express = require("express");
const router = express.Router();
const { askAI, chatgpt, claude } = require("../controllers/aiController");

router.post("/ask", askAI);
router.post("/chatgpt", chatgpt);
router.post("/claude", claude);

module.exports = router;

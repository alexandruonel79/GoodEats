const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/send", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post("http://localhost:8000/chat", { message });
    res.json({ reply: response.data.reply });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).send("Chatbot service is unavailable");
  }
});

module.exports = router;

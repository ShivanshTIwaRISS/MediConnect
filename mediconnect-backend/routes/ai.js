const express = require('express');
const router = express.Router();
const axios = require('axios');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

router.post('/chat', async (req, res) => {
    try {
        const { messages } = req.body;
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ success: false, message: 'Groq API key not configured on server' });
        }

        const response = await axios.post(
            GROQ_API_URL,
            {
                model: 'llama3-8b-8192',
                messages: messages,
                temperature: 0.7,
                max_tokens: 1024,
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        res.json({ success: true, content: response.data.choices[0].message.content });
    } catch (error) {
        console.error('Groq API Error:', error.response?.data || error.message);
        res.status(500).json({ success: false, message: 'Failed to connect to AI service' });
    }
});

module.exports = router;

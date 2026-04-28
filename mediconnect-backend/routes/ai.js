const express = require('express');
const router = express.Router();
const axios = require('axios');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

router.post('/chat', async (req, res) => {
    console.log('AI Chat Request received');
    try {
        const { messages } = req.body;
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ success: false, message: 'Groq API key not configured on server' });
        }

        // --- RAG: Fetch Doctors Context ---
        const doctors = await Doctor.find({ status: 'approved' }).populate('userId', 'name email');
        
        const doctorsContext = doctors.map(doc => {
            return `Name: Dr. ${doc.userId.name}, Specialization: ${doc.specialization}, Fees: ₹${doc.fees}, Experience: ${doc.experience} years, About: ${doc.about || 'N/A'}`;
        }).join('\n');

        // Inject Context into the System Prompt
        const updatedMessages = [...messages];
        const systemMessageIndex = updatedMessages.findIndex(m => m.role === 'system');
        
        const ragPrompt = `
        AVAILABLE DOCTORS IN MEDICONNECT:
        ${doctorsContext || 'No doctors currently available.'}
        
        When suggesting a doctor, use only the names from the list above. 
        If a patient asks for a recommendation, pick the most relevant doctor based on their specialization.
        `;

        if (systemMessageIndex !== -1) {
            updatedMessages[systemMessageIndex].content += "\n" + ragPrompt;
        } else {
            updatedMessages.unshift({ role: 'system', content: ragPrompt });
        }

        const response = await axios.post(
            GROQ_API_URL,
            {
                model: 'llama3-8b-8192',
                messages: updatedMessages,
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

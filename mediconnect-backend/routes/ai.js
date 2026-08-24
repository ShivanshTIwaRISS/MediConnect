const express = require('express');
const router = express.Router();
const axios = require('axios');
const Doctor = require('../models/Doctor');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const PRIMARY_MODEL = 'openai/gpt-oss-120b';
const FALLBACK_MODELS = ['openai/gpt-oss-20b', 'groq/compound'];

router.post('/chat', async (req, res) => {
    try {
        const { messages } = req.body;
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ success: false, message: 'Groq API key not configured on server' });
        }

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid messages array provided' });
        }

        // --- Fetch Doctors Context (RAG) ---
        let doctorsContext = '';
        try {
            const doctors = await Doctor.find({ status: 'approved' }).populate('userId', 'name email');
            if (doctors && doctors.length > 0) {
                doctorsContext = doctors.map(doc => {
                    const name = doc.userId?.name || 'Practitioner';
                    return `- Dr. ${name}: ${doc.specialization} ($${doc.fees}, ${doc.experience} yrs exp) - ${doc.about || 'Specialist'}`;
                }).join('\n');
            }
        } catch (dbErr) {
            console.warn('Could not load doctors context for AI:', dbErr.message);
        }

        // Inject Context into the System Prompt
        const updatedMessages = [...messages];
        const systemMessageIndex = updatedMessages.findIndex(m => m.role === 'system');
        
        const ragPrompt = `
CURRENT VERIFIED SPECIALISTS IN SYSTEM:
${doctorsContext || 'Specialists are accessible in the Find Doctors section.'}

INSTRUCTIONS:
- Recommend specialists from the verified list when relevant.
- Keep responses friendly, concise, and formatted with clear bullet points when explaining steps.
`;

        if (systemMessageIndex !== -1) {
            updatedMessages[systemMessageIndex].content += "\n" + ragPrompt;
        } else {
            updatedMessages.unshift({ role: 'system', content: ragPrompt });
        }

        // Attempt primary model, then fallback models if needed
        const candidateModels = [PRIMARY_MODEL, ...FALLBACK_MODELS];
        let lastError = null;

        for (const model of candidateModels) {
            try {
                const response = await axios.post(
                    GROQ_API_URL,
                    {
                        model,
                        messages: updatedMessages,
                        temperature: 0.7,
                        max_tokens: 1024,
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${apiKey}`,
                            'Content-Type': 'application/json',
                        },
                        timeout: 15000,
                    }
                );

                const content = response.data?.choices?.[0]?.message?.content;
                if (content) {
                    return res.json({ success: true, content });
                }
            } catch (err) {
                lastError = err;
                console.warn(`Groq model ${model} failed:`, err.response?.data?.error?.message || err.message);
            }
        }

        console.error('All Groq candidate models failed:', lastError?.response?.data || lastError?.message);
        res.status(500).json({ 
            success: false, 
            message: lastError?.response?.data?.error?.message || 'Failed to connect to AI service' 
        });
    } catch (error) {
        console.error('AI Chat Error:', error.response?.data || error.message);
        res.status(500).json({ success: false, message: 'Internal server error processing AI request' });
    }
});

module.exports = router;

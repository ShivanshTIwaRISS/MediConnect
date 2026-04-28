import axios from 'axios';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const API_KEY = process.env.REACT_APP_GROQ_API_KEY;

const groqService = {
    async getChatCompletion(messages) {
        try {
            const response = await axios.post(
                GROQ_API_URL,
                {
                    model: 'llama-3.3-70b-versatile', // or 'llama3-8b-8192'
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 1024,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('Error calling Groq API:', error);
            throw error;
        }
    },
};

export default groqService;

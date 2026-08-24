import axios from 'axios';
import api from './api';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const FALLBACK_API_KEY = process.env.REACT_APP_GROQ_API_KEY || '';
const CANDIDATE_MODELS = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'groq/compound'];

const groqService = {
    async getChatCompletion(messages) {
        // 1. Primary: Use backend /api/ai/chat route
        try {
            const response = await api.post('/ai/chat', { messages }, { timeout: 12000 });
            if (response.data && response.data.success && response.data.content) {
                return response.data.content;
            }
        } catch (backendError) {
            console.warn('Backend AI service unreachable or failed, attempting direct Groq API fallback:', backendError.message);
        }

        // 2. Direct Groq fallback if configured via client environment
        if (FALLBACK_API_KEY) {
            let lastError = null;
            for (const model of CANDIDATE_MODELS) {
                try {
                    const directResponse = await axios.post(
                        GROQ_API_URL,
                        {
                            model,
                            messages,
                            temperature: 0.7,
                            max_tokens: 1024,
                        },
                        {
                            headers: {
                                'Authorization': `Bearer ${FALLBACK_API_KEY}`,
                                'Content-Type': 'application/json',
                            },
                            timeout: 12000,
                        }
                    );

                    const content = directResponse.data?.choices?.[0]?.message?.content;
                    if (content) {
                        return content;
                    }
                } catch (groqErr) {
                    lastError = groqErr;
                    console.warn(`Direct Groq fallback model ${model} failed:`, groqErr.response?.data?.error?.message || groqErr.message);
                }
            }
            if (lastError) {
                throw new Error(lastError?.response?.data?.error?.message || lastError?.message || 'Failed to get response from AI');
            }
        }

        throw new Error('AI service is unreachable. Please ensure the backend server is running on port 5001.');
    },
};

export default groqService;

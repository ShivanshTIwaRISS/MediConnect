import axios from 'axios';
import api from './api';
import { generateSmartResponse } from './clinicalEngine';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const FALLBACK_API_KEY = process.env.REACT_APP_GROQ_API_KEY || '';
const CANDIDATE_MODELS = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'groq/compound'];

const groqService = {
    async getChatCompletion(messages, userInfo = {}) {
        const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content || '';
        const role = userInfo.role || 'patient';
        const userName = userInfo.name || 'User';

        // 1. Primary: Try backend /api/ai/chat route
        try {
            const response = await api.post('/ai/chat', { messages }, { timeout: 6000 });
            if (response.data && response.data.success && response.data.content) {
                return response.data.content;
            }
        } catch (backendError) {
            console.warn('Backend AI service unreachable or offline, trying alternative channels:', backendError.message);
        }

        // 2. Secondary: Direct Groq API fallback if configured
        if (FALLBACK_API_KEY) {
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
                            timeout: 8000,
                        }
                    );

                    const content = directResponse.data?.choices?.[0]?.message?.content;
                    if (content) {
                        return content;
                    }
                } catch (groqErr) {
                    console.warn(`Direct Groq fallback model ${model} failed:`, groqErr.response?.data?.error?.message || groqErr.message);
                }
            }
        }

        // 3. Guaranteed In-App Clinical Engine: Zero-latency, intelligent assistant response
        return generateSmartResponse(lastUserMsg, role, userName);
    },
};

export default groqService;

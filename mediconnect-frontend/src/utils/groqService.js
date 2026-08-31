import api from './api';
import { generateSmartResponse } from './clinicalEngine';

const groqService = {
    async getChatCompletion(messages, userInfo = {}) {
        const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content || '';
        const role = userInfo.role || 'patient';
        const userName = userInfo.name || 'User';

        // Primary: Send to backend /api/ai/chat (auth-protected, DB-grounded)
        // The backend handles model fallback internally and builds role-specific
        // system prompts with real database context. We do NOT call Groq directly
        // from the frontend because it bypasses all database context and causes
        // the model to hallucinate doctor names and data.
        try {
            const response = await api.post('/ai/chat', { messages }, { timeout: 18000 });
            if (response.data && response.data.success && response.data.content) {
                return response.data.content;
            }
        } catch (backendError) {
            console.warn('Backend AI service unreachable:', backendError.message);
        }

        // Fallback: Local clinical engine (zero-latency, no network needed)
        // This provides role-aware navigation guidance WITHOUT any doctor names
        // since it has no database access. It only guides users to the right
        // UI sections based on their role.
        return generateSmartResponse(lastUserMsg, role, userName);
    },
};

export default groqService;

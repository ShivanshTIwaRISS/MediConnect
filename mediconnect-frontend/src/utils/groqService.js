import api from './api';

const groqService = {
    async getChatCompletion(messages) {
        try {
            const response = await api.post('/ai/chat', { messages });
            if (response.data.success) {
                return response.data.content;
            } else {
                throw new Error(response.data.message || 'Failed to get response from AI');
            }
        } catch (error) {
            console.error('Error calling Backend AI Service:', error);
            throw error;
        }
    },
};

export default groqService;

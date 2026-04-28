import api from './api';

const groqService = {
    async getChatCompletion(messages) {
        console.log('Sending message to backend AI:', messages);
        try {
            // Using our configured 'api' instance which handles the base URL and auth tokens
            const response = await api.post('/ai/chat', { messages });
            
            console.log('Backend response:', response.data);
            
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

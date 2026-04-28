import api from './api';
import axios from 'axios';

const groqService = {
    async getChatCompletion(messages) {
        console.log('Sending message to backend AI:', messages);
        try {
            const response = await axios.post('http://localhost:5001/api/ai/chat', { messages }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
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

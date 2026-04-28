import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import groqService from '../utils/groqService';
import './ChatAgent.css';

const ChatAgent = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Initial greeting and system prompt configuration
    useEffect(() => {
        if (user && messages.length === 0) {
            const role = user.role || 'user';
            const greeting = role === 'doctor' 
                ? `Hello Dr. ${user.name}, I'm your MediConnect assistant. How can I help you manage your appointments today?`
                : `Hi ${user.name}! I'm your MediConnect assistant. I can help you find doctors, book appointments, or navigate the platform. What can I do for you?`;
            
            setMessages([{ role: 'assistant', content: greeting }]);
        }
    }, [user, messages.length]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Construct system prompt
            const systemPrompt = {
                role: 'system',
                content: `You are the MediConnect AI Assistant, a specialized agent for the MediConnect Healthcare Platform.
                
                YOUR CONTEXT:
                - User: ${user.name} (${user.role})
                - System: MediConnect is a platform for online doctor consultations, appointment booking, and medical record management.
                
                CORE DIRECTIVES:
                1. STAY WITHIN SCOPE: Only discuss MediConnect features, medical appointments, and doctor recommendations. If asked about general knowledge (e.g., "who is the president"), politely refuse and steer back to MediConnect.
                2. PATIENT ASSISTANCE:
                   - Recommend doctors by suggesting they visit the "Find Doctors" section.
                   - Guide them to "Book Appointment" menu to schedule visits.
                   - Remind them they can view "My Appointments" to see status updates.
                3. DOCTOR ASSISTANCE:
                   - Help them manage "Appointment Requests".
                   - Remind them to update their "Doctor Profile" for better visibility.
                   - Explain how to view patient medical history via the dashboard.
                4. BOOKING FLOW: If a patient wants to book, tell them: "To book an appointment, please go to the 'Book Appointment' page from your sidebar/menu, or select a doctor from the 'Find Doctors' list and click 'Book Now'."
                
                TONE: Professional, medical-grade, and helpful. Keep responses concise.`
            };

            const chatHistory = [systemPrompt, ...messages, userMessage];
            const response = await groqService.getChatCompletion(chatHistory);
            
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting right now. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user || (user.role !== 'patient' && user.role !== 'doctor')) return null;

    return (
        <div className="chat-agent-container">
            <button 
                className="chat-toggle-btn" 
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle AI Assistant"
            >
                {isOpen ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                )}
            </button>

            <div className={`chat-window ${isOpen ? 'open' : ''}`}>
                <div className="chat-header">
                    <h3>
                        <span className="status-dot"></span>
                        MediConnect AI
                    </h3>
                </div>

                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.role === 'user' ? 'user' : 'bot'}`}>
                            {msg.content}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="typing-indicator">
                            <span className="typing-dot"></span>
                            <span className="typing-dot"></span>
                            <span className="typing-dot"></span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form className="chat-input-container" onSubmit={handleSend}>
                    <input 
                        type="text" 
                        className="chat-input" 
                        placeholder="Type your message..." 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                    />
                    <button type="submit" className="send-btn" disabled={isLoading || !input.trim()}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatAgent;

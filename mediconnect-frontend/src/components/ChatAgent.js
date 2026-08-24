import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import groqService from '../utils/groqService';
import Icon from './Icons';
import './ChatAgent.css';

const ROLE_SUGGESTIONS = {
    patient: [
        'Find a specialist doctor',
        'How do I book an appointment?',
        'Where can I see my visits?',
        'What health tips do you have?'
    ],
    doctor: [
        'How do I manage appointment requests?',
        'How do I update my consultation hours?',
        'Where do I view patient history?'
    ],
    admin: [
        'Where do I approve new doctors?',
        'How do I manage registered users?',
        'Overview of platform metrics'
    ]
};

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
            const role = user.role || 'patient';
            let greeting = `Hi ${user.name}! I'm your MediConnect AI Clinical Assistant. How can I help you today?`;
            
            if (role === 'doctor') {
                greeting = `Hello Dr. ${user.name}, I'm your MediConnect clinical assistant. How can I help manage your appointments and patient schedules today?`;
            } else if (role === 'admin') {
                greeting = `Welcome Administrator ${user.name}. I'm your MediConnect operations assistant. I can guide you through doctor verifications, platform metrics, and user management.`;
            }
            
            setMessages([{ role: 'assistant', content: greeting }]);
        }
    }, [user, messages.length]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const sendMessage = async (textToSend) => {
        const query = (textToSend || input).trim();
        if (!query || isLoading) return;

        const userMessage = { role: 'user', content: query };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const role = user?.role || 'patient';
            const systemPrompt = {
                role: 'system',
                content: `You are the MediConnect AI Assistant, a specialized agent for the MediConnect Healthcare Platform.
                
YOUR CONTEXT:
- User Name: ${user?.name || 'User'}
- User Role: ${role}
- Platform: MediConnect (Doctor consultations, online appointment bookings, healthcare records).

DIRECTIVES BASED ON ROLE:
1. PATIENT:
   - Help them search for verified specialists in "Find Doctors".
   - Guide them to "Book Appointment" to select dates and times.
   - Explain how to view scheduled and past appointments in "My Appointments".
2. DOCTOR:
   - Assist in managing consultation requests under "Appointment Requests".
   - Guide on adjusting consultation schedule and biography under "Profile & Settings".
   - Guide on checking previous patient consultations under "Consultation History".
3. ADMIN:
   - Guide on reviewing, approving, or suspending practitioners under "Manage Doctors".
   - Guide on auditing patient/doctor accounts under "Manage Users".
   - Explain monitoring platform appointments under "All Appointments".

SCOPE LIMIT: Stay strictly within MediConnect healthcare platform capabilities and general medical navigation. Do not provide unverified medical diagnoses; recommend consulting a qualified specialist. Keep responses concise, professional, and helpful.`
            };

            const chatHistory = [systemPrompt, ...messages, userMessage];
            const response = await groqService.getChatCompletion(chatHistory);
            
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        } catch (error) {
            setMessages(prev => [
                ...prev,
                { 
                    role: 'assistant', 
                    content: "I'm having trouble connecting to the AI service right now. Please ensure the backend server is running and try again." 
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = (e) => {
        e.preventDefault();
        sendMessage();
    };

    const handleClearChat = () => {
        const role = user?.role || 'patient';
        let greeting = `Hi ${user?.name || 'there'}! Chat history cleared. How else can I assist you?`;
        if (role === 'doctor') greeting = `Dr. ${user?.name}, chat reset. What would you like to check?`;
        if (role === 'admin') greeting = `Administrator ${user?.name}, chat reset. What platform operations can I help with?`;
        setMessages([{ role: 'assistant', content: greeting }]);
    };

    if (!user) return null;

    const suggestions = ROLE_SUGGESTIONS[user.role] || ROLE_SUGGESTIONS.patient;

    return (
        <div className="chat-agent-container">
            {/* Floating Toggle Button */}
            <button 
                className="chat-toggle-btn" 
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
                title="MediConnect AI Assistant"
            >
                {isOpen ? (
                    <Icon name="x" size={24} color="white" />
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            <path d="M8 10h.01M12 10h.01M16 10h.01" />
                        </svg>
                    </div>
                )}
            </button>

            {/* Chat Window */}
            <div className={`chat-window ${isOpen ? 'open' : ''}`}>
                <div className="chat-header">
                    <div className="chat-header-info">
                        <div className="chat-avatar-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                                <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
                            </svg>
                        </div>
                        <div>
                            <h3>MediConnect AI</h3>
                            <span className="chat-header-sub">
                                <span className="status-dot"></span> Online Assistant
                            </span>
                        </div>
                    </div>
                    <div className="chat-header-actions">
                        <button 
                            className="chat-action-btn"
                            onClick={handleClearChat}
                            title="Clear conversation"
                            aria-label="Clear chat"
                        >
                            <Icon name="trash" size={16} color="white" />
                        </button>
                        <button 
                            className="chat-action-btn"
                            onClick={() => setIsOpen(false)}
                            title="Close"
                            aria-label="Close assistant"
                        >
                            <Icon name="x" size={18} color="white" />
                        </button>
                    </div>
                </div>

                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.role === 'user' ? 'user' : 'bot'}`}>
                            {msg.role === 'assistant' && (
                                <div className="bot-msg-header">
                                    <span className="bot-name">MediConnect AI</span>
                                </div>
                            )}
                            <div className="msg-text">{msg.content}</div>
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

                {/* Suggestion Chips */}
                {messages.length <= 2 && (
                    <div className="chat-suggestions">
                        {suggestions.map((suggestion, i) => (
                            <button
                                key={i}
                                type="button"
                                className="suggestion-chip"
                                onClick={() => sendMessage(suggestion)}
                                disabled={isLoading}
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                )}

                <form className="chat-input-container" onSubmit={handleSend}>
                    <input 
                        type="text" 
                        className="chat-input" 
                        placeholder="Ask about doctors, appointments, or services..." 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                    />
                    <button type="submit" className="send-btn" disabled={isLoading || !input.trim()}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatAgent;

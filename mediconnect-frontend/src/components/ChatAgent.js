import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import groqService from '../utils/groqService';
import Icon from './Icons';
import './ChatAgent.css';

const ROLE_SUGGESTIONS = {
    patient: [
        'I have a fever 🤒',
        'Suggest a skin specialist',
        'How to book an appointment?',
        'I have a headache',
        'Compare doctor consultation fees',
        'Show my appointments'
    ],
    doctor: [
        'Show my appointment stats',
        'How to update my schedule?',
        'Check my profile verification status',
        'View consultation history'
    ],
    admin: [
        'Pending doctor applications',
        'Platform metrics overview',
        'Show all doctors directory',
        'Total registered users'
    ]
};

// ─── Markdown-lite renderer: converts AI markdown to React elements ──────────
const renderMessageContent = (text) => {
    if (!text) return null;

    // Split by lines and process
    const lines = text.split('\n');
    const elements = [];
    let key = 0;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        // Process inline markdown on the line
        const processedLine = processInlineMarkdown(line, `line-${key++}`);
        elements.push(processedLine);

        // Add line break between lines (but not after last)
        if (i < lines.length - 1) {
            elements.push(<br key={`br-${key++}`} />);
        }
    }

    return elements;
};

const processInlineMarkdown = (text, keyPrefix) => {
    if (!text || typeof text !== 'string') return text;

    // Split text by markdown patterns and process
    const parts = [];
    let remaining = text;
    let partKey = 0;

    while (remaining.length > 0) {
        // Match markdown links: [text](/path) or [text](url)
        const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
        // Match bold: **text**
        const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);

        // Find the earliest match
        let earliestMatch = null;
        let earliestIndex = Infinity;
        let matchType = null;

        if (linkMatch && linkMatch.index < earliestIndex) {
            earliestMatch = linkMatch;
            earliestIndex = linkMatch.index;
            matchType = 'link';
        }
        if (boldMatch && boldMatch.index < earliestIndex) {
            earliestMatch = boldMatch;
            earliestIndex = boldMatch.index;
            matchType = 'bold';
        }

        if (!earliestMatch) {
            // No more patterns, add remaining text
            parts.push(remaining);
            break;
        }

        // Add text before the match
        if (earliestIndex > 0) {
            parts.push(remaining.substring(0, earliestIndex));
        }

        // Process the match
        if (matchType === 'link') {
            const linkText = earliestMatch[1];
            const linkHref = earliestMatch[2];

            // Internal links start with /
            if (linkHref.startsWith('/')) {
                parts.push(
                    <Link
                        key={`${keyPrefix}-link-${partKey++}`}
                        to={linkHref}
                        className="chat-inline-link"
                        onClick={(e) => e.stopPropagation()}
                    >
                        🔗 {linkText}
                    </Link>
                );
            } else {
                parts.push(
                    <a
                        key={`${keyPrefix}-a-${partKey++}`}
                        href={linkHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="chat-inline-link"
                    >
                        {linkText}
                    </a>
                );
            }
        } else if (matchType === 'bold') {
            parts.push(
                <strong key={`${keyPrefix}-b-${partKey++}`}>
                    {earliestMatch[1]}
                </strong>
            );
        }

        // Move past the match
        remaining = remaining.substring(earliestIndex + earliestMatch[0].length);
    }

    if (parts.length === 0) return text;
    if (parts.length === 1 && typeof parts[0] === 'string') return parts[0];

    return <span key={keyPrefix}>{parts}</span>;
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
            let greeting = '';
            
            if (role === 'doctor') {
                greeting = `Hello Dr. ${user.name}! 🩺 I'm your MediConnect Clinical Assistant. How can I help you manage your practice, appointment requests, or consultation hours today?`;
            } else if (role === 'admin') {
                greeting = `Welcome Administrator ${user.name}! 🛡️ I'm your MediConnect Operations Assistant. I can assist with doctor verifications, platform metrics, and user management. What would you like to check?`;
            } else {
                greeting = `Hi ${user.name}! 👋 I'm your MediConnect Health Assistant. How can I help you today? Feel free to ask about doctors, symptoms, or booking appointments in English or Hinglish!`;
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
            // Build chat history with ONLY user/assistant messages.
            // The backend builds the authoritative system prompt server-side
            // using the authenticated user's role + live database context.
            const chatHistory = messages
                .filter(m => m.role === 'user' || m.role === 'assistant')
                .concat(userMessage);

            const response = await groqService.getChatCompletion(chatHistory, {
                role: user?.role || 'patient',
                name: user?.name || 'User',
            });
            
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        } catch (error) {
            const role = user?.role || 'patient';
            let fallbackMsg = "I'm your MediConnect AI Health Assistant. You can ask me how to find verified specialists, schedule consultations, or view your visits.";
            if (role === 'doctor') {
                fallbackMsg = "I'm your MediConnect Clinical Assistant, Dr. " + (user?.name || '') + ". You can ask me about managing appointment requests, updating your schedule, or reviewing consultation history.";
            } else if (role === 'admin') {
                fallbackMsg = "I'm your MediConnect Operations Assistant. I can help with doctor verifications, user management, and platform metrics.";
            }
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: fallbackMsg }
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
        let greeting = `Hi ${user?.name || 'there'}! Conversation cleared. How else can I assist you?`;
        if (role === 'doctor') greeting = `Dr. ${user?.name}, conversation reset. What would you like to check?`;
        if (role === 'admin') greeting = `Administrator ${user?.name}, conversation reset. What platform operations can I help with?`;
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
                                <span className="status-dot"></span> {user.role === 'patient' ? 'Health Assistant' : user.role === 'doctor' ? 'Clinical Assistant' : 'Operations Assistant'}
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
                            <div className="msg-text">{renderMessageContent(msg.content)}</div>
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
                        placeholder={user.role === 'patient' ? 'Ask about doctors, symptoms, or appointments...' : 'Ask about platform operations, doctors, or metrics...'} 
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

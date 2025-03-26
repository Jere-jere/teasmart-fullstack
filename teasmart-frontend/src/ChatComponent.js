import React, { useState } from 'react';
import axios from 'axios';

const ChatComponent = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { text: input, sender: 'user' }];
        setMessages(newMessages);
        console.log('User Message Added:', newMessages); // Debugging

        try {
            const response = await axios.post('http://localhost:5000/api/chat', { message: input });
            console.log('API Response:', response.data); // Debugging

            const updatedMessages = [...newMessages, { text: response.data.reply, sender: 'bot' }];
            setMessages(updatedMessages);
            console.log('Bot Message Added:', updatedMessages); // Debugging
        } catch (error) {
            console.error('Error:', error);
            setMessages([...newMessages, { text: "Error: Unable to get a response", sender: 'bot' }]);
        }

        setInput("");
    };

    return (
        <div style={{ 
            position: 'fixed', 
            bottom: '60px', 
            right: '20px', 
            width: '300px', 
            backgroundColor: 'none', 
            borderRadius: '10px', 
            overflow: 'hidden' 
        }}>
            {/* Toggle Button with Bot Icon */}
            <div 
                style={{ 
                    backgroundColor: '#007bff', 
                    color: '#fff', 
                    width: '70px', 
                    height: '70px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    cursor: 'pointer', 
                    margin: '10px auto', 
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)' 
                }}
                onClick={() => setIsOpen(!isOpen)}
            >
                {/* Bot Icon */}
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="30" 
                    height="30" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    style={{ color: '#fff' }}
                >
                    <path d="M12 8V4H8" />
                    <rect width="16" height="12" x="4" y="8" rx="2" />
                    <circle cx="9" cy="14" r="1" />
                    <circle cx="15" cy="14" r="1" />
                    <path d="M9 18h6" />
                </svg>
            </div>

            {/* Chat Interface (Visible when isOpen is true) */}
            {isOpen && (
                <>
                    <div style={{ 
                        height: '200px', 
                        overflowY: 'auto', 
                        padding: '5px', 
                        borderBottom: '1px solid #ddd', 
                        backgroundColor: '#fff' 
                    }}>
                        {messages.map((msg, index) => (
                            <div key={index} style={{ 
                                textAlign: msg.sender === 'user' ? 'right' : 'left', 
                                margin: '5px 0' 
                            }}>
                                <span style={{
                                    background: msg.sender === 'user' ? '#007bff' : '#000',
                                    color: '#fff',
                                    padding: '5px 10px',
                                    borderRadius: '10px',
                                    display: 'inline-block',
                                    maxWidth: '80%',
                                    whiteSpace: 'normal',
                                    wordWrap: 'break-word'
                                }}>
                                    {msg.text}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', marginTop: '10px', padding: '10px' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            style={{ 
                                flex: 1, 
                                padding: '5px', 
                                border: '1px solid #ccc', 
                                borderRadius: '5px', 
                                marginRight: '5px' 
                            }}
                            placeholder="Type a message..."
                        />
                        <button 
                            onClick={handleSend} 
                            style={{ 
                                padding: '5px 10px', 
                                backgroundColor: '#007bff', 
                                color: '#fff', 
                                border: 'none', 
                                borderRadius: '5px', 
                                cursor: 'pointer' 
                            }}
                        >
                            Send
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ChatComponent;
// chatbot-widget.js
// AI Business Chatbot Widget - Plain JavaScript

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        botId: 'bot_2784cdc20eae0160',
        apiUrl: 'http://localhost:3000',
        primaryColor: '#2563eb',
        welcomeMessage: '👋 Hello! I\'m Imran\'s AI assistant. Ask me about my projects, skills, or experience!',
        fallbackMessage: 'I don\'t have that info yet. Please email Imran at imranka641@gmail.com!',
        chatbotName: 'Imran\'s AI Assistant'
    };

    // Create the widget HTML
    function createWidget() {
        const widget = document.createElement('div');
        widget.id = 'ai-chatbot-widget';
        widget.innerHTML = `
            <style>
                /* Widget Styles */
                #ai-chatbot-widget * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                #ai-chatbot-widget {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 999999;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                /* Chat Button */
                .chat-toggle-btn {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: ${CONFIG.primaryColor};
                    border: none;
                    color: white;
                    font-size: 28px;
                    cursor: pointer;
                    box-shadow: 0 4px 20px rgba(37, 99, 235, 0.3);
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                }

                .chat-toggle-btn:hover {
                    transform: scale(1.08);
                    box-shadow: 0 6px 30px rgba(37, 99, 235, 0.4);
                }

                .chat-toggle-btn .status-dot {
                    position: absolute;
                    bottom: 4px;
                    right: 4px;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: #22c55e;
                    border: 2px solid white;
                }

                /* Chat Window */
                .chat-window {
                    position: fixed;
                    bottom: 90px;
                    right: 20px;
                    width: 380px;
                    height: 520px;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
                    display: none;
                    flex-direction: column;
                    overflow: hidden;
                    transition: all 0.3s ease;
                    border: 1px solid rgba(0,0,0,0.05);
                }

                .chat-window.open {
                    display: flex;
                    animation: slideUp 0.3s ease;
                }

                /* Header */
                .chat-header {
                    padding: 16px 20px;
                    background: ${CONFIG.primaryColor};
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-shrink: 0;
                }

                .chat-header-left {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .chat-header-avatar {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                }

                .chat-header h3 {
                    font-size: 16px;
                    font-weight: 600;
                }

                .chat-header-status {
                    font-size: 11px;
                    opacity: 0.8;
                    display: block;
                }

                .chat-close-btn {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    font-size: 20px;
                    padding: 4px 8px;
                    border-radius: 6px;
                    transition: background 0.2s;
                }

                .chat-close-btn:hover {
                    background: rgba(255,255,255,0.15);
                }

                /* Messages */
                .chat-messages {
                    flex: 1;
                    padding: 16px;
                    overflow-y: auto;
                    background: #f8fafc;
                    min-height: 0;
                }

                .chat-messages::-webkit-scrollbar {
                    width: 4px;
                }

                .chat-messages::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }

                .chat-messages::-webkit-scrollbar-thumb {
                    background: ${CONFIG.primaryColor};
                    border-radius: 10px;
                }

                .message {
                    margin-bottom: 12px;
                    padding: 10px 14px;
                    border-radius: 12px;
                    max-width: 85%;
                    word-wrap: break-word;
                    font-size: 14px;
                    line-height: 1.5;
                    animation: fadeIn 0.3s ease;
                }

                .message.user {
                    background: ${CONFIG.primaryColor};
                    color: white;
                    margin-left: auto;
                    border-bottom-right-radius: 4px;
                }

                .message.bot {
                    background: white;
                    color: #1a1a1a;
                    border: 1px solid #e2e8f0;
                    border-bottom-left-radius: 4px;
                }

                .message.bot .source {
                    font-size: 10px;
                    color: #64748b;
                    margin-top: 6px;
                    display: block;
                    border-top: 1px solid #e2e8f0;
                    padding-top: 6px;
                }

                /* Typing Indicator */
                .typing-indicator {
                    display: none;
                    padding: 10px 14px;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    max-width: 60px;
                    margin-bottom: 12px;
                    border-bottom-left-radius: 4px;
                }

                .typing-indicator.show {
                    display: inline-block;
                }

                .typing-indicator span {
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #94a3b8;
                    margin: 0 2px;
                    animation: typing 1.4s infinite both;
                }

                .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
                .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

                /* Input Area */
                .chat-input-area {
                    padding: 12px 16px;
                    border-top: 1px solid #e2e8f0;
                    display: flex;
                    gap: 8px;
                    background: white;
                    flex-shrink: 0;
                }

                .chat-input {
                    flex: 1;
                    padding: 10px 14px;
                    border: 1px solid #d1d5db;
                    border-radius: 10px;
                    outline: none;
                    font-size: 14px;
                    transition: border-color 0.2s;
                }

                .chat-input:focus {
                    border-color: ${CONFIG.primaryColor};
                    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
                }

                .chat-send-btn {
                    padding: 10px 18px;
                    background: ${CONFIG.primaryColor};
                    color: white;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s;
                }

                .chat-send-btn:hover {
                    background: #1d4ed8;
                    transform: translateY(-1px);
                }

                .chat-send-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                /* Animations */
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes typing {
                    0%, 60%, 100% { transform: translateY(0); }
                    30% { transform: translateY(-6px); }
                }

                /* Responsive */
                @media (max-width: 480px) {
                    .chat-window {
                        width: 100vw;
                        height: 100vh;
                        bottom: 0;
                        right: 0;
                        border-radius: 0;
                        bottom: 0 !important;
                    }

                    .chat-toggle-btn {
                        bottom: 20px;
                        right: 20px;
                        width: 56px;
                        height: 56px;
                        font-size: 24px;
                    }
                }
            </style>

            <!-- Chat Button -->
            <button class="chat-toggle-btn" id="chatToggleBtn" aria-label="Open chat">
                💬
                <span class="status-dot"></span>
            </button>

            <!-- Chat Window -->
            <div class="chat-window" id="chatWindow">
                <div class="chat-header">
                    <div class="chat-header-left">
                        <div class="chat-header-avatar">🤖</div>
                        <div>
                            <h3>${CONFIG.chatbotName}</h3>
                            <span class="chat-header-status">● Online</span>
                        </div>
                    </div>
                    <button class="chat-close-btn" id="chatCloseBtn">✕</button>
                </div>

                <div class="chat-messages" id="chatMessages">
                    <div class="message bot">
                        ${CONFIG.welcomeMessage}
                    </div>
                </div>

                <div class="typing-indicator" id="typingIndicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <div class="chat-input-area">
                    <input type="text" class="chat-input" id="chatInput" placeholder="Type your message..." />
                    <button class="chat-send-btn" id="chatSendBtn">Send</button>
                </div>
            </div>
        `;

        document.body.appendChild(widget);
    }

    // Chat functionality
    function initChat() {
        const toggleBtn = document.getElementById('chatToggleBtn');
        const closeBtn = document.getElementById('chatCloseBtn');
        const chatWindow = document.getElementById('chatWindow');
        const messagesContainer = document.getElementById('chatMessages');
        const input = document.getElementById('chatInput');
        const sendBtn = document.getElementById('chatSendBtn');
        const typingIndicator = document.getElementById('typingIndicator');

        let conversationId = null;
        let isOpen = false;

        // Toggle chat
        function toggleChat() {
            isOpen = !isOpen;
            chatWindow.classList.toggle('open', isOpen);
            if (isOpen) {
                input.focus();
            }
        }

        toggleBtn.addEventListener('click', toggleChat);
        closeBtn.addEventListener('click', toggleChat);

        // Send message
        async function sendMessage() {
            const message = input.value.trim();
            if (!message) return;

            // Disable input
            input.disabled = true;
            sendBtn.disabled = true;

            // Add user message
            addMessage(message, 'user');
            input.value = '';

            // Show typing indicator
            typingIndicator.classList.add('show');
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            try {
                const response = await fetch(`${CONFIG.apiUrl}/api/v1/chat/${CONFIG.botId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: message,
                        conversationId: conversationId
                    })
                });

                const data = await response.json();

                // Hide typing indicator
                typingIndicator.classList.remove('show');

                if (data.success) {
                    const answer = data.data.answer;
                    const sources = data.data.sources || [];
                    conversationId = data.data.conversationId || conversationId;

                    // Add bot response
                    let html = answer;
                    if (sources.length > 0) {
                        html += `<span class="source">📚 Sources: ${sources.map(s => s.title).join(', ')}</span>`;
                    }
                    addMessage(html, 'bot');
                } else {
                    addMessage('Sorry, I encountered an error. Please try again.', 'bot');
                }
            } catch (error) {
                typingIndicator.classList.remove('show');
                addMessage('Network error. Please check your connection.', 'bot');
                console.error('Chat error:', error);
            }

            // Re-enable input
            input.disabled = false;
            sendBtn.disabled = false;
            input.focus();
        }

        // Add message to chat
        function addMessage(content, type) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${type}`;
            messageDiv.innerHTML = content;
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        // Event listeners
        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        // Handle escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) {
                toggleChat();
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            createWidget();
            initChat();
        });
    } else {
        createWidget();
        initChat();
    }
})();

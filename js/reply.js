const body = document.body;
const chatContainer = document.getElementById('chatContainer');
const messageInput = document.querySelector('.message-input');
const sendButton = document.querySelector('.send-button');
const typingIndicator = document.querySelector('.typing-indicator');

// API endpoint and key for OpenRouter Mistral model
const apiUrl = "https://openrouter.ai/api/v1/chat/completions";
const API_KEY = "Bearer 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";

// Base prompt to provide context for the model
const basePrompt = `You are a defender of deep-tech innovation. Respond intelligently to the user's queries on technology and innovation, especially focusing on areas like semiconductors, AI, robotics, EVs, space tech, quantum computing, and global moonshots. Commerce Minister Piyush Goyal has urged Indian tech founders to focus on these fields over food delivery and quick-commerce models.`;

// Create message element
function createMessageElement(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    messageDiv.innerHTML = `
        <div class="avatar">${isUser ? 'U' : 'AI'}</div>
        <div class="message-bubble">${content}</div>
    `;
    
    return messageDiv;
}

// Add message to chat
function addMessage(content, isUser = false) {
    const messageElement = createMessageElement(content, isUser);
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Show and hide typing indicator
function showTypingIndicator() {
    typingIndicator.style.display = 'block';
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function hideTypingIndicator() {
    typingIndicator.style.display = 'none';
}

async function getBotResponse(userMessage) {
    showTypingIndicator();

    try {
        console.log('Sending POST to /api/chat with message:', userMessage);
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userMessage })
        });

        console.log('Raw API response:', response);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            throw new Error('Failed to fetch response from the API.');
        }

        const data = await response.json();
        console.log('API Response:', data);

        // Handle the response
        if (data.message) {
            addMessage(data.message);  // Display the bot's response
        } else {
            addMessage("I'm sorry, I couldn't get a response. Please try again later.");
        }
    } catch (error) {
        console.error('Error fetching bot response:', error);
        addMessage("There was an error communicating with the bot. Please try again later.");
    } finally {
        hideTypingIndicator();
    }
}



// Handle user input
function handleSendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        addMessage(message, true);  // Add user message
        messageInput.value = '';    // Clear input
        getBotResponse(message);  // Get bot response via OpenRouter API
    }
}

// Handle canned replies
function handleCannedReply(userText) {
    addMessage(userText, true); // Add user message
    getBotResponse(userText);  // Get bot response via OpenRouter API
}

// Event listeners
sendButton.addEventListener('click', handleSendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSendMessage();
    }
});

// Initial greeting
setTimeout(() => {
    addMessage("Start your take — I'm ready to disagree.");
}, 500);

// Canned responses (example buttons)
document.querySelectorAll('.canned-response').forEach(button => {
    button.addEventListener('click', (e) => {
        handleCannedReply(e.target.innerText);
    });
});

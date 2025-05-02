const body = document.body;
const chatContainer = document.getElementById('chatContainer');
const messageInput = document.querySelector('.message-input');
const sendButton = document.querySelector('.send-button');
const typingIndicator = document.querySelector('.typing-indicator');

// API endpoint for your backend API route
const apiUrl = "/api/chat";  // This refers to your Vercel serverless function or backend

// Base prompt to simulate Anurag's persona
const basePrompt = `
You are Anurag, the writer of an open letter urging tech startups in India to focus on deep-tech innovation instead of food delivery and quick-commerce models. You defend the stance that India should lead in fields like semiconductors, AI, robotics, EVs, space tech, and quantum computing. Respond intelligently to user queries, maintaining this position.

If the user greets, simply greet them back. 
If the user asks unrelated questions, tell them to stick to the topic of innovation and technology.
If the user comments on tech startups, respond in defense of the vision of building India's future through deep-tech innovation.
`;

// Create message element
function createMessageElement(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    messageDiv.innerHTML = `
        <div class="avatar">${isUser ? 'You' : 'Anurag'}</div>
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
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userMessage, prompt: basePrompt })
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
        console.error('Error fetching Anurag\'s response:', error);
        addMessage("There was an error communicating with Anurag. Please try again later.");
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
        getBotResponse(message);  // Get bot response from backend API
    }
}

// Handle canned replies
function handleCannedReply(userText) {
    addMessage(userText, true); // Add user message
    getBotResponse(userText);  // Get bot response via backend API
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


// UTSAAH hiding animation on scroll
$(function () {
var text = $(".uts-text");
$(window).scroll(function () {
    var scroll = $(window).scrollTop();

    if (scroll >= 10) {
        text.addClass("hidden");
    } else {
        text.removeClass("hidden");
    }
});
});

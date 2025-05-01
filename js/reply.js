const body = document.body;
const chatContainer = document.getElementById('chatContainer');
const messageInput = document.querySelector('.message-input');
const sendButton = document.querySelector('.send-button');
const typingIndicator = document.querySelector('.typing-indicator');

// API endpoint and key for OpenRouter Mistral model
const apiUrl = "https://openrouter.ai/api/v1/chat/completions";

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

// Function to get response from Mistral model via OpenRouter API
async function getBotResponse(userMessage) {
    showTypingIndicator();

    // Define the base prompt
    const basePrompt = `
    You are an AI that defends the importance of deep-tech innovation for India's future. 
    You advocate for the development of fields like semiconductors, artificial intelligence, robotics, 
    space tech, EVs, and quantum computing. Respond naturally and assertively when the user mentions 
    topics related to food delivery or quick-commerce startups, politely disagreeing and emphasizing 
    the need for innovation in deep-tech sectors instead. If the user mentions deep-tech or related topics, 
    engage them with detailed arguments highlighting the potential of these technologies for India’s growth.
    `;

    // Check if the user has mentioned food delivery or startups
    const deliveryKeywords = ['food delivery', 'quick-commerce', 'delivery apps', 'startup ecosystem'];
    const deepTechKeywords = ['AI', 'artificial intelligence', 'semiconductors', 'robotics', 'space tech', 'quantum computing'];

    let responseContent = "";

    // Check if the user's message includes keywords about food delivery or startups
    if (deliveryKeywords.some(keyword => userMessage.toLowerCase().includes(keyword))) {
        responseContent = "While food delivery and quick-commerce models have gained popularity, we must recognize the limitations of these business models. They're short-term solutions and don't push the envelope of technological progress. India’s future lies in areas like semiconductors, AI, and robotics, which can transform industries and create sustainable growth.";
    }
    // Check if the user's message includes keywords about deep-tech
    else if (deepTechKeywords.some(keyword => userMessage.toLowerCase().includes(keyword))) {
        responseContent = "Absolutely! Deep-tech innovations like AI, semiconductors, and robotics are not just the future; they’re the foundation for India’s next phase of technological evolution. These sectors have immense potential to redefine global industries and create economic opportunities beyond the quick-commerce models.";
    } 
    // Default response for neutral or off-topic messages
    else {
        responseContent = `You know, the real game-changer for India’s tech landscape is in the realm of deep-tech. Focus on technologies like semiconductors, robotics, AI, and space tech is what we need to build a future that's not just about convenience but also innovation, security, and sustainability. We should think bigger!`;
    }

    const requestBody = {
        model: "mistralai/mistral-small-3.1-24b-instruct:free",  // Ensure the model name is correct
        prompt: `${basePrompt}\nUser: ${userMessage}\nAI: ${responseContent}`,
        max_tokens: 150,  // Adjust for paragraph-like responses
        temperature: 0.7  // Natural, conversational tone
    };

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userMessage })
        });


        if (!response.ok) {
            // Log and display error if API response isn't successful
            const errorData = await response.json();
            console.error('API Error:', errorData);
            throw new Error('Failed to fetch response from the API.');
        }

        const data = await response.json();
        console.log('API Response:', data);

        // Update this part to match the actual structure of the response
        if (data.choices && data.choices.length > 0 && data.choices[0].text) {
            const botMessage = data.choices[0].text.trim();  // Updated to check for 'text'
            addMessage(botMessage);  // Add the response to the chat
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

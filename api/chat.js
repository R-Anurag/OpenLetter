// Vercel Backend API handler (api/chat.js)
const fetch = require('node-fetch');  // Add this if you're using Node.js

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { userMessage } = req.body;

        // API endpoint for OpenRouter Mistral Model
        const apiUrl = "https://openrouter.ai/api/v1/chat/completions";
        const apiKey = process.env.OPENROUTER_API_KEY;  // Store your API key in environment variables

        const requestBody = {
            model: "mistralai/mistral-small-3.1-24b-instruct:free",  // Ensure the model name is correct
            prompt: `You are a defender of deep-tech innovation. Respond intelligently to the user's queries on technology and innovation, especially focusing on areas like semiconductors, AI, robotics, EVs, space tech, quantum computing, and global moonshots. Commerce Minister Piyush Goyal has urged Indian tech founders to focus on these fields over food delivery and quick-commerce models. User: ${userMessage}`,
            max_tokens: 150,  // Adjust for paragraph-like responses
            temperature: 0.7  // Natural, conversational tone
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`  // Include the API key for authentication
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                return res.status(response.status).json({ error: errorData });
            }

            const data = await response.json();
            return res.status(200).json(data);  // Send back the response to the frontend

        } catch (error) {
            return res.status(500).json({ error: 'Error fetching data from OpenRouter API.' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}

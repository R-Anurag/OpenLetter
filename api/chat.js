// api/chat.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    try {
        const { userMessage } = req.body;
        
        if (!userMessage) {
            return res.status(400).json({ message: 'No user message provided' });
        }

        // OpenRouter API endpoint
        const apiUrl = "https://openrouter.ai/api/v1/chat/completions";
        const apiKey = process.env.OPENROUTER_API_KEY; // Store your API key in environment variables

        // Request body for OpenRouter API
        const requestBody = {
            model: "mistralai/mistral-small-3.1-24b-instruct:free",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: userMessage
                        }
                    ]
                }
            ]
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': '<YOUR_SITE_URL>',  // Optional, replace with your site URL
                'X-Title': '<YOUR_SITE_NAME>'       // Optional, replace with your site title
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (response.ok && data.choices && data.choices.length > 0) {
            res.status(200).json({ message: data.choices[0].text.trim() });
        } else {
            res.status(500).json({ message: 'Failed to get a valid response from OpenRouter.' });
        }
    } catch (error) {
        console.error('Error during OpenRouter request:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

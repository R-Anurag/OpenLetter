const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { userMessage } = req.body;

        if (!userMessage) {
            return res.status(400).json({ message: 'No message provided.' });
        }

        const requestBody = {
            model: 'mistralai/mistral-small-3.1-24b-instruct:free',
            prompt: `You are a defender of deep-tech innovation. Respond intelligently to the user's queries on technology and innovation, especially focusing on areas like semiconductors, AI, robotics, EVs, space tech, quantum computing, and global moonshots. Commerce Minister Piyush Goyal has urged Indian tech founders to focus on these fields over food delivery and quick-commerce models.\n\nUser: ${userMessage}`,
            max_tokens: 150,
            temperature: 0.7
        };

        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            if (response.ok) {
                return res.status(200).json({ message: data.choices[0]?.text || "Sorry, something went wrong." });
            } else {
                console.error('OpenRouter API Error:', data);  // Log OpenRouter error
                return res.status(500).json({ message: data.error || 'Failed to get a response from OpenRouter.' });
            }
        } catch (error) {
            console.error('Internal Server Error:', error);  // Log server error
            return res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}

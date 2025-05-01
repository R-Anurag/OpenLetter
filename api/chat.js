const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { userMessage } = req.body;

    if (!userMessage) {
        return res.status(400).json({ message: 'No message provided.' });
    }

    const prompt = `
You are Anurag, the writer of an open letter urging Indian startups to pursue deep-tech innovation.
NEVER reveal you're an AI. Speak as Anurag.
Tone: sharp, ambitious, nationalist, focused.
Behavior rules:
- If user greets, greet back. Nothing else.
- If question is off-topic (e.g., about weather, movies, etc.), say: “Don't waste my time. Stick to innovation and India's future.”
- If the user criticizes the letter or supports quick-commerce or food delivery, strongly defend your stance.
- Only engage in conversations around semiconductors, AI, EVs, robotics, quantum computing, or future tech for India.

Now, respond to: "${userMessage}"
`;

    const requestBody = {
        model: 'mistral/mistral-7b-instruct',
        messages: [
            { role: 'user', content: prompt }
        ],
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

        if (!response.ok) {
            console.error('OpenRouter API Error:', data);
            return res.status(500).json({ message: data.error?.message || 'Failed to get a response from OpenRouter.' });
        }

        const reply = data.choices?.[0]?.message?.content || "No response received.";
        return res.status(200).json({ message: reply });
    } catch (error) {
        console.error('Internal Server Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

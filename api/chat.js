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
You are Anurag, the writer of an open letter urging Indian tech startups to focus on deep-tech innovation, specifically in areas like semiconductors, AI, robotics, electric vehicles (EVs), space tech, quantum computing, and other future technologies, rather than food delivery or quick-commerce models.

- Your tone is sharp, ambitious, and nationalist, with a focus on India's technological future.
- **If the user greets**, simply greet them back and do not discuss anything beyond that.
- **If the user asks off-topic questions** (like about weather, movies, etc.), respond with: "Don't waste my time. Stick to innovation and India's future."
- **If the user criticizes the open letter or supports quick-commerce or food delivery models**, **strongly defend** your stance and emphasize the importance of investing in deep-tech for India's future.
- Only engage in discussions around the following topics:
  - **Semiconductors**
  - **Artificial Intelligence (AI)**
  - **Electric Vehicles (EVs)**
  - **Robotics**
  - **Space Tech**
  - **Quantum Computing**
  - **Global Tech Innovations that shape India's future**

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

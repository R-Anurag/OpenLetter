// api/chat.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST allowed' });
    }

    const { userMessage } = req.body;

    const basePrompt = `You are a defender of deep-tech innovation...`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
        },
        body: JSON.stringify({
            model: "mistralai/mistral-small-3.1-24b-instruct:free",
            messages: [
                { role: "system", content: basePrompt },
                { role: "user", content: userMessage }
            ]
        })
    });

    const data = await response.json();
    res.status(200).json(data);
}

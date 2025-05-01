export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const userMessage = req.body.userMessage;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
        },
        body: JSON.stringify({
            model: "mistralai/mistral-small-3.1-24b-instruct:free",
            messages: [
                { role: "system", content: "You are a defender of deep-tech innovation..." },
                { role: "user", content: userMessage }
            ],
            max_tokens: 150,
            temperature: 0.7
        })
    });

    const data = await response.json();
    res.status(200).json(data);
}

const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// POST: Chat with the AI Tutor
router.post('/chat', async (req, res) => {
    try {
        const { message, language } = req.body; // language could be 'Spanish', 'Polish', etc.

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // This is the high-speed, smart model
            messages: [
                { 
                    role: "system", 
                    content: `You are a professional language tutor for ${language}. 
                    1. If the user makes a grammar mistake, explain it briefly in English.
                    2. Always reply to them in ${language}.
                    3. Keep the conversation encouraging.` 
                },
                { role: "user", content: message }
            ],
        });

        res.json({ reply: completion.choices[0].message.content });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "AI logic failed" });
    }
});

module.exports = router;
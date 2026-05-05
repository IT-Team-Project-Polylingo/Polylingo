const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const auth = require('../middleware/auth');
const Conversation = require('../models/Conversation');
const { isNonEmptyString } = require('../utils/token');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// POST: Chat with the AI Tutor (protected)
router.post('/chat', auth, async (req, res) => {
    try {
        const { message, language } = req.body; // language could be 'Spanish', 'Polish', etc.
        if (!isNonEmptyString(message, 1, 4000) || !isNonEmptyString(language, 2, 50)) {
            return res.status(400).json({ message: 'Missing message or language' });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are a professional language tutor for ${language}.\n1. If the user makes a grammar mistake, explain it briefly in English.\n2. Always reply to them in ${language}.\n3. Keep the conversation encouraging.`
                },
                { role: "user", content: message }
            ],
        });

        const reply = completion.choices?.[0]?.message?.content ?? null;
        if (!reply) return res.status(500).json({ error: 'No reply from AI' });

        await Conversation.findOneAndUpdate(
            { user: req.user.id, language },
            {
                $push: {
                    messages: {
                        $each: [
                            { role: 'user', content: message },
                            { role: 'assistant', content: reply },
                        ],
                    },
                },
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.json({ reply });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "AI logic failed" });
    }
});

module.exports = router;
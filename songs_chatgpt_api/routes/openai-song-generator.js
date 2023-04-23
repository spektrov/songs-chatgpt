const express = require('express');
const router = express.Router();

const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config()

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function generateSongLyrics (prompt, verseCount, language) {
    const completion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `Generate song lyrics based on the following topic:\n\n${prompt}\n
        One quatrain is 4 rows of text or 1 verse. Lyrics should have ${verseCount} quatrains.\n
        The language of lyrics is ${language}\n\n
        Lyrics:`,
        temperature: 0.7,
        max_tokens: 400,
    });

    console.log(completion.data);

    return completion.data.choices[0].text.trim();
}

// Get song body
router.get('/', async (req, res) => {

    const songTopic = req.query.topic ?? "About love and death";
    const verseCount = req.query.verse ?? 2;
    let language = req.query.language ?? "en";
    if (language.startsWith("ukr")){
        language = "Використовуй українську мову та алфавіт для лірики"
    }

    const generatedLyrics = await generateSongLyrics(songTopic, verseCount, language);
    res.json(generatedLyrics);
});

module.exports = router;

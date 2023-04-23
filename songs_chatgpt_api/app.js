const express = require('express');
const app = express();
const songsRouter = require('./routes/songs');
const songsGenerator = require('./routes/openai-song-generator');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use('/api/songs', songsRouter);
app.use('/api/song-body', songsGenerator);


const PORT = process.env.PORT || 8283;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

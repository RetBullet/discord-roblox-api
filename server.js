const express = require('express');
const axios = require('axios');
const app = express();

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const PORT = process.env.PORT || 3000;

app.get('/check/:discordId', async (req, res) => {
    try {
        const response = await axios.get(
            `https://discord.com/api/v10/guilds/${GUILD_ID}/members/${req.params.discordId}`,
            { headers: { 'Authorization': `Bot ${DISCORD_BOT_TOKEN}` } }
        );
        res.json({ 
            inServer: true,
            username: response.data.user.username 
        });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.json({ inServer: false });
        } else {
            res.json({ 
                error: 'RequestFailed',
                details: error.message 
            });
        }
    }
});

app.get('/', (req, res) => {
    res.send('Discord verification API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
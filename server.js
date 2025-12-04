const express = require('express');
const axios = require('axios');
const app = express();

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const PORT = process.env.PORT || 3000;

app.get('/check/:discordId', async (req, res) => {
    const discordId = req.params.discordId;
    
    console.log('=== NEW REQUEST ===');
    console.log('Discord ID:', discordId);
    console.log('Guild ID:', GUILD_ID);
    console.log('Token exists:', !!DISCORD_BOT_TOKEN);
    console.log('Token first 10 chars:', DISCORD_BOT_TOKEN ? DISCORD_BOT_TOKEN.substring(0, 10) : 'MISSING');
    
    try {
        const url = `https://discord.com/api/v10/guilds/${GUILD_ID}/members/${discordId}`;
        console.log('Request URL:', url);
        
        const response = await axios.get(url, { 
            headers: { 'Authorization': `Bot ${DISCORD_BOT_TOKEN}` } 
        });
        
        console.log('✅ SUCCESS - User found on server');
        console.log('Username:', response.data.user.username);
        
        res.json({ 
            inServer: true,
            username: response.data.user.username 
        });
    } catch (error) {
        console.log('❌ ERROR');
        console.log('Status:', error.response ? error.response.status : 'NO RESPONSE');
        console.log('Message:', error.message);
        
        if (error.response) {
            console.log('Response data:', JSON.stringify(error.response.data));
        }
        
        if (error.response && error.response.status === 404) {
            res.json({ inServer: false });
        } else {
            res.json({ 
                error: 'RequestFailed',
                details: error.message,
                status: error.response ? error.response.status : 'unknown'
            });
        }
    }
});

app.get('/', (req, res) => {
    res.send('Discord verification API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('GUILD_ID:', GUILD_ID);
    console.log('Token exists:', !!DISCORD_BOT_TOKEN);
});

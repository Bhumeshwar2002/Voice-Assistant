const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Endpoint for OpenRouter.ai
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
  
    try {
      const response = await axios.post(
        OPENROUTER_API_URL,
        {
          model: 'gpt-3.5-turbo', // Ensure this model is available in OpenRouter
          messages: [
            { role: 'system', content: 'You are a helpful and witty AI assistant named Freddy.' },
            { role: 'user', content: message },
          ],
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          },
        }
      );
  
      res.json({ reply: response.data.choices[0].message.content.trim() });
    } catch (error) {
      console.error('OpenRouter.ai Error:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'Failed to get response from OpenRouter.ai' });
    }
  });
  
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

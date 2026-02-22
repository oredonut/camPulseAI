import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

console.log('Server starting...');
console.log('API Key loaded:', OPENROUTER_API_KEY ? '✓ Yes' : '✗ No');
console.log('API Key length:', OPENROUTER_API_KEY?.length);

app.post('/api/chat', async (req, res) => {
  try {
    console.log('\n--- Chat request received ---');
    
    if (!OPENROUTER_API_KEY) {
      console.error('❌ Missing OPENROUTER_API_KEY in environment');
      return res.status(500).json({ error: 'API key not configured' });
    }

    const { messages } = req.body;
    console.log('Messages received:', messages?.length || 0);

    if (!messages || !Array.isArray(messages)) {
      console.error('❌ Invalid messages format');
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    console.log('📤 Sending to OpenRouter...');
    const response = await fetch('https://openrouter.io/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'mistralai/devstral-small',
        messages: messages,
      }),
    });

    const data = await response.json();
    console.log('OpenRouter response status:', response.status);
    
    if (!response.ok) {
      console.error('❌ OpenRouter API error:', data);
      return res.status(response.status).json(data);
    }
    
    console.log('✓ Success - sending response back');
    res.json(data);
  } catch (error) {
    console.error('❌ Server error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

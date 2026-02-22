#!/usr/bin/env node

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import fs from 'fs';

const dotenvResult = dotenv.config();
console.log('dotenv load:', dotenvResult.error ? `error:${dotenvResult.error.message}` : `parsed keys:${Object.keys(dotenvResult.parsed || {}).join(',')}`);
console.log('cwd:', process.cwd());
console.log('.env exists:', fs.existsSync('.env'));
if (fs.existsSync('.env')) {
  const envRaw = fs.readFileSync('.env', 'utf8');
  console.log('.env length:', envRaw.length, 'preview:', envRaw.slice(0,200).replace(/\r/g,'\\r').replace(/\n/g,'\\n'));
}

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Get API key
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

console.log('🚀 Server starting on port', PORT);
console.log('✓ API Key configured:', OPENROUTER_API_KEY);

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    console.log('\n📨 Chat request received');
    
    // if (!OPENROUTER_API_KEY) {
    //   console.error('❌ API key missing!');
    //   return res.status(500).json({ error: 'API key not configured' });
    // }

    const { messages } = req.body;
    
    // if (!messages || !Array.isArray(messages)) {
    //   console.error('❌ Invalid messages');
    //   return res.status(400).json({ error: 'Invalid messages format' });
    // }

    // console.log(`📤 Sending ${messages.length} messages to OpenRouter...`);
    
    const response = await fetch('https://openrouter.io/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer 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`,
      },
      body: JSON.stringify({
        model: 'mistralai/devstral-small',
        messages: messages,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ OpenRouter error:', data.error?.message || data);
      return res.status(response.status).json(data);
    }
    
    console.log('✅ Response received successfully');
    res.json(data);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log('Ready to receive chat requests!');
});

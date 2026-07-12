const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // CORS headers biar frontend bisa akses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, model } = req.body;

    // Ambil API key dari environment variable Vercel
    const apiKey = process.env.AI_API_KEY;
    const endpoint = process.env.AI_ENDPOINT || 'https://api.iamhc.cn/v1/chat/completions';
    const defaultModel = process.env.AI_MODEL || 'glm-4.7';

    if (!apiKey || apiKey === 'GANTI_DENGAN_API_KEY_KAMU') {
      return res.status(500).json({ 
        error: 'API key belum diatur. Tambahkan AI_API_KEY di pengaturan Environment Variables Vercel.' 
      });
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model || defaultModel,
        messages: messages,
        temperature: 0.5,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI provider error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: 'Gagal menghubungi AI provider. Cek API key dan endpoint.' 
      });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, service: 'SiBantu API', version: 2 });
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages wajib diisi.' });
    }

    // Batasi ukuran permintaan agar API publik tidak mudah disalahgunakan.
    const safeMessages = messages.slice(-16).map((message) => ({
      role: ['system', 'assistant', 'user'].includes(message?.role) ? message.role : 'user',
      content: String(message?.content || '').slice(0, 12000)
    }));
    const totalCharacters = safeMessages.reduce((sum, message) => sum + message.content.length, 0);
    if (totalCharacters > 30000) {
      return res.status(413).json({ error: 'Percakapan terlalu panjang. Muat ulang halaman lalu coba lagi.' });
    }

    const apiKey = String(process.env.AI_API_KEY || '').trim();
    const endpoint = process.env.AI_ENDPOINT || 'https://api.iamhc.cn/v1/chat/completions';
    // Model dikendalikan dari Vercel, bukan dari browser.
    const selectedModel = process.env.AI_MODEL || 'glm-4.7';

    if (!apiKey || apiKey === 'GANTI_DENGAN_API_KEY_KAMU') {
      return res.status(500).json({ error: 'API key belum diatur di Vercel.' });
    }

    const requestBody = JSON.stringify({
      model: selectedModel,
      messages: safeMessages,
      temperature: 0.65,
      max_tokens: 700
    });

    let lastStatus = 500;
    let lastMessage = 'Provider tidak merespons.';

    // Provider kadang memberi 429/5xx sementara. Coba ulang satu kali otomatis.
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
          },
          body: requestBody,
          signal: AbortSignal.timeout(25000)
        });

        if (response.ok) {
          const data = await response.json();
          return res.status(200).json(data);
        }

        const errorText = await response.text();
        lastStatus = response.status;
        lastMessage = errorText;
        try {
          const parsed = JSON.parse(errorText);
          lastMessage = parsed?.error?.message || parsed?.message || errorText;
        } catch (_) {}

        console.error(`AI provider error (attempt ${attempt}):`, response.status, errorText);
        const temporaryError = [429, 500, 502, 503, 504].includes(response.status);
        if (!temporaryError || attempt === 2) break;
        await new Promise((resolve) => setTimeout(resolve, 900));
      } catch (error) {
        lastStatus = 504;
        lastMessage = error?.name === 'TimeoutError' ? 'Provider AI terlalu lama merespons.' : error.message;
        console.error(`AI request error (attempt ${attempt}):`, error);
        if (attempt === 2) break;
        await new Promise((resolve) => setTimeout(resolve, 900));
      }
    }

    return res.status(lastStatus).json({
      error: 'AI sedang sibuk. Coba kirim lagi sebentar.',
      provider_status: lastStatus,
      provider_message: String(lastMessage).slice(0, 500)
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
};

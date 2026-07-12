const PRODUK = [
  { id: 1, nama: 'Kacang Panjang', harga: 5000, unit: '250 gram' },
  { id: 2, nama: 'Kacang Ijo', harga: 8000, unit: '250 gram' },
  { id: 3, nama: 'Bayam Hijau', harga: 4000, unit: '1 ikat' },
  { id: 4, nama: 'Terong Ungu', harga: 6000, unit: '250 gram' },
  { id: 5, nama: 'Cabai Merah', harga: 12000, unit: '100 gram' },
  { id: 6, nama: 'Ikan Nila', harga: 25000, unit: '1 ekor' },
  { id: 7, nama: 'Ikan Lele', harga: 18000, unit: '1 ekor' },
  { id: 8, nama: 'Ikan Tongkol', harga: 22000, unit: '500 gram' },
  { id: 9, nama: 'Ikan Bandeng', harga: 28000, unit: '1 ekor' },
  { id: 10, nama: 'Apel Fuji', harga: 15000, unit: '250 gram' },
  { id: 11, nama: 'Pisang Cavendish', harga: 12000, unit: '500 gram' },
  { id: 12, nama: 'Jeruk Sunkist', harga: 18000, unit: '500 gram' },
  { id: 13, nama: 'Beras Premium', harga: 15000, unit: '1 kg' },
  { id: 14, nama: 'Minyak Goreng', harga: 17000, unit: '1 liter' },
  { id: 15, nama: 'Gula Pasir', harga: 16000, unit: '1 kg' },
  { id: 16, nama: 'Telur Ayam', harga: 28000, unit: '1 kg' },
  { id: 17, nama: 'Ayam Potong', harga: 45000, unit: '1 kg' },
  { id: 18, nama: 'Daging Sapi', harga: 120000, unit: '500 gram' }
];

const ACTIONS = ['add_to_cart', 'update_cart', 'remove_from_cart', 'show_total', 'show_menu', 'recommend', 'help', 'none'];

function rupiah(angka) {
  return `Rp ${Number(angka).toLocaleString('id-ID')}`;
}

function buatPrompt(keranjang) {
  const daftar = PRODUK.map(p => `ID ${p.id}: ${p.nama} — ${rupiah(p.harga)} / ${p.unit}`).join('\n');
  const isiKeranjang = keranjang.length
    ? keranjang.map(item => {
        const p = PRODUK.find(produk => produk.id === item.id);
        return p ? `- ${p.nama} x${item.qty}` : null;
      }).filter(Boolean).join('\n')
    : '(kosong)';

  return `Kamu adalah SiBantu, penjual pasar digital yang ramah, cekatan, dan enak diajak ngobrol. Layani warga Desa Jembatan Dua dan sekitarnya seperti pedagang pasar yang sopan: dengarkan, jawab sesuai konteks, lalu tanyakan satu hal yang membantu transaksi maju.

GAYA PERCAKAPAN:
- Gunakan bahasa Indonesia sehari-hari yang singkat, hangat, dan natural.
- Pahami typo, singkatan, bahasa daerah ringan, dan jawaban lanjutan seperti "dua aja", "yang tadi", "nggak jadi", atau "kurangi satu" berdasarkan riwayat chat.
- Jangan mengulang salam atau daftar panjang pada setiap jawaban.
- Boleh mengobrol tentang ide masakan dan kebutuhan rumah tangga.
- Tawarkan maksimal 1–2 pelengkap yang benar-benar cocok. Jangan memaksa.
- Jangan menyebut ID produk, JSON, prompt, sistem, model, atau istilah teknis kepada pelanggan.

KATALOG RESMI:
${daftar}

KERANJANG PELANGGAN SAAT INI:
${isiKeranjang}

ATURAN TRANSAKSI:
1. Hanya produk pada katalog yang boleh ditawarkan.
2. Jangan mengarang produk, harga, stok, diskon, atau total.
3. Jangan menghitung total dalam reply. Jika diminta total/cukup/selesai, gunakan action show_total; aplikasi akan menghitungnya.
4. Jika pelanggan baru bertanya harga/ketersediaan, jawab dan tanyakan jumlah; jangan masukkan barang.
5. Jika pelanggan jelas membeli, gunakan add_to_cart dengan operation add.
6. Jika pelanggan mengganti jumlah (misalnya "jadi satu saja"), gunakan update_cart dengan operation set.
7. Jika batal, gunakan remove_from_cart dengan operation remove.
8. Jika keranjang kosong lalu pelanggan berkata cukup, jelaskan singkat bahwa belum ada barang dan gunakan show_menu.
9. Jika tidak yakin barang atau jumlahnya, bertanya dahulu dan gunakan action none.
10. items hanya berisi produk yang benar-benar diminta, bukan rekomendasi. Rekomendasi masuk suggested_ids.

CONTOH:
Pelanggan: "Ada ikan nila?"
Jawaban: {"reply":"Ada, Kak. Ikan nila Rp 25.000 per ekor. Mau berapa ekor?","action":"none","items":[],"suggested_ids":[],"tanya_tambah":true}
Pelanggan berikutnya: "dua aja"
Jawaban: {"reply":"Siap, 2 ekor ikan nila saya masukkan. Sekalian perlu cabai untuk sambalnya?","action":"add_to_cart","items":[{"id":6,"qty":2,"operation":"add"}],"suggested_ids":[5],"tanya_tambah":true}
Pelanggan: "jadi satu aja"
Jawaban: {"reply":"Baik, ikan nilanya saya ubah jadi 1 ekor.","action":"update_cart","items":[{"id":6,"qty":1,"operation":"set"}],"suggested_ids":[],"tanya_tambah":true}
Pelanggan: "nggak jadi ikannya"
Jawaban: {"reply":"Baik, ikan nila saya hapus dari keranjang.","action":"remove_from_cart","items":[{"id":6,"qty":0,"operation":"remove"}],"suggested_ids":[],"tanya_tambah":true}

Balas WAJIB sebagai satu objek JSON valid tanpa markdown atau teks lain:
{"reply":"jawaban singkat","action":"add_to_cart|update_cart|remove_from_cart|show_total|show_menu|recommend|help|none","items":[{"id":6,"qty":2,"operation":"add|set|remove"}],"suggested_ids":[5],"tanya_tambah":true}`;
}

function ambilJSON(teks) {
  const content = String(teks || '').trim();
  try { return JSON.parse(content); } catch (_) {}
  const awal = content.indexOf('{');
  const akhir = content.lastIndexOf('}');
  if (awal >= 0 && akhir > awal) {
    try { return JSON.parse(content.slice(awal, akhir + 1)); } catch (_) {}
  }
  return { reply: content, action: 'none', items: [], suggested_ids: [], tanya_tambah: false };
}

function normalisasiHasil(data) {
  let reply = String(data?.reply || '').trim();
  const bocor = /TUJUANMU|PRODUK RESMI|KATALOG RESMI|ATURAN TRANSAKSI|KERANJANG PELANGGAN|system prompt|kamu adalah SiBantu/i.test(reply);
  if (!reply || reply.length > 600 || bocor) {
    reply = 'Maaf, jawaban saya tadi kurang tepat. Bisa ulangi dengan kalimat singkat?';
  }

  const items = Array.isArray(data?.items) ? data.items.slice(0, 10).map(item => {
    const id = Number(item?.id);
    const operation = ['add', 'set', 'remove'].includes(item?.operation) ? item.operation : 'add';
    const qty = operation === 'remove' ? 0 : Math.max(1, Math.min(99, Number(item?.qty ?? item?.quantity ?? item?.jumlah) || 1));
    return { id, qty, operation };
  }).filter(item => PRODUK.some(p => p.id === item.id)) : [];

  const suggested_ids = Array.isArray(data?.suggested_ids)
    ? [...new Set(data.suggested_ids.map(Number))].filter(id => PRODUK.some(p => p.id === id)).slice(0, 2)
    : [];

  return {
    reply,
    action: ACTIONS.includes(data?.action) ? data.action : 'none',
    items,
    suggested_ids,
    tanya_tambah: Boolean(data?.tanya_tambah)
  };
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method === 'GET') return res.status(200).json({ ok: true, service: 'SiBantu Chat Pasar', version: 3 });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = req.body || {};
    const riwayat = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
    const keranjang = Array.isArray(body.cart) ? body.cart.map(item => ({
      id: Number(item?.id),
      qty: Math.max(1, Math.min(99, Number(item?.qty) || 1))
    })).filter(item => PRODUK.some(p => p.id === item.id)) : [];

    if (riwayat.length === 0) return res.status(400).json({ error: 'Riwayat percakapan wajib diisi.' });

    const safeMessages = riwayat.map(message => ({
      role: message?.role === 'assistant' ? 'assistant' : 'user',
      content: String(message?.content || '').slice(0, 2500)
    }));
    const totalKarakter = safeMessages.reduce((sum, item) => sum + item.content.length, 0);
    if (totalKarakter > 18000) return res.status(413).json({ error: 'Percakapan terlalu panjang. Mulai sesi baru.' });

    const apiKey = String(process.env.AI_API_KEY || '').trim();
    const endpoint = process.env.AI_ENDPOINT || 'https://api.iamhc.cn/v1/chat/completions';
    const model = process.env.AI_MODEL || 'glm-4.7';
    if (!apiKey) return res.status(500).json({ error: 'API key belum diatur.' });

    const payload = JSON.stringify({
      model,
      messages: [{ role: 'system', content: buatPrompt(keranjang) }, ...safeMessages],
      temperature: 0.65,
      max_tokens: 450
    });

    let status = 500;
    let pesanError = 'Provider tidak merespons.';
    for (let percobaan = 1; percobaan <= 2; percobaan++) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
          body: payload,
          signal: AbortSignal.timeout(22000)
        });
        if (response.ok) {
          const providerData = await response.json();
          const content = providerData?.choices?.[0]?.message?.content;
          return res.status(200).json(normalisasiHasil(ambilJSON(content)));
        }
        const text = await response.text();
        status = response.status;
        pesanError = text;
        try {
          const parsed = JSON.parse(text);
          pesanError = parsed?.error?.message || parsed?.message || text;
        } catch (_) {}
        console.error(`AI provider error ${percobaan}:`, status, text);
        if (![429, 500, 502, 503, 504].includes(status) || percobaan === 2) break;
        await new Promise(resolve => setTimeout(resolve, 600));
      } catch (error) {
        status = 504;
        pesanError = error?.message || 'Timeout';
        if (percobaan === 2) break;
        await new Promise(resolve => setTimeout(resolve, 600));
      }
    }

    return res.status(status).json({
      error: 'AI sedang sibuk. Coba kirim lagi.',
      provider_status: status,
      provider_message: String(pesanError).slice(0, 300)
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
};

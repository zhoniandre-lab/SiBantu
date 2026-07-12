# 🤝 SiBantu

**SiBantu – Semua Urusan Jadi Mudah.**

Aplikasi chatbot sederhana untuk bantu ibu rumah tangga memesan bahan pokok harian.
Area layanan pertama: Desa Jembatan Dua, Kec. Kaur Selatan, Kab. Kaur, Bengkulu.

## 📁 Struktur Folder

```
sibantu/
├── api/
│   └── chat.js          # Backend kecil untuk menghubungi AI
├── public/
│   └── index.html       # Tampilan aplikasi / chatbot
├── package.json         # Konfigurasi Node.js
├── vercel.json          # Konfigurasi deploy Vercel
└── README.md            # Panduan ini
```

## 🚀 Cara Upload ke GitHub

### Metode 1: Upload Langsung Lewat Web (Paling Mudah)

1. Buka [github.com](https://github.com) dan login
2. Klik tombol **+** di pojok kanan atas → **New repository**
3. Isi **Repository name**: `sibantu`
4. Pilih **Public** (biar Vercel bisa akses)
5. Klik **Create repository**
6. Di halaman repository baru, klik **uploading an existing file**
7. Upload folder dan file ini:
   - folder `api/`
   - folder `public/`
   - `package.json`
   - `vercel.json`
   - `README.md`
8. Klik **Commit changes**

## 🌐 Cara Deploy ke Vercel

1. Buka [vercel.com](https://vercel.com) dan login dengan GitHub
2. Klik **Add New Project**
3. Cari repository `sibantu` → klik **Import**
4. Klik **Deploy**
5. Tunggu sampai selesai, dapat link seperti:
   `https://sibantu-username.vercel.app`

## 🔑 Cara Menambahkan API Key AI

1. Di dashboard Vercel, pilih project `sibantu`
2. Klik tab **Settings**
3. Pilih **Environment Variables**
4. Tambahkan variabel berikut:

| Name | Value |
|------|-------|
| `AI_API_KEY` | API key dari akun api.iamhc.cn |
| `AI_MODEL` | `glm-4.7` |
| `AI_ENDPOINT` | `https://api.iamhc.cn/v1/chat-completions` |

5. Klik **Save**
6. Kembali ke tab **Deployments**
7. Klik titik 3 di deploy terbaru → **Redeploy**

## ✅ Cek Setelah Deploy

Buka link Vercel, coba chat:
- "mau kacang panjang 2, ikan nila 1"
- "udah cukup"
- "total berapa"

Kalau AI merespons dengan benar, berarti sudah jalan! 🎉

## 📞 Ganti Nomor WhatsApp Admin

Buka file `public/index.html`, cari baris:
```
const noAdmin = '6281234567890';
```

Ganti dengan nomor WhatsApp kamu (format Indonesia, contoh: `6281234567890`).

## 🛠️ Ganti Model AI

Di Vercel Environment Variables, ubah `AI_MODEL` menjadi salah satu:
- `glm-4.7`
- `qwen3.6-35b-a3b`
- `deepseek-v4-flash`
- `step-3.5-flash`

Jangan lupa **Redeploy** setelah mengubah.

---

Dibuat untuk mempermudah urusan sehari-hari. 🙏

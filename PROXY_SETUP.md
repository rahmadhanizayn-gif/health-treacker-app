# MAINTAIN HEALTH - Proxy Server Setup

Aplikasi web untuk monitoring kesehatan dengan AI assistant (HealthMind) yang dipowerkan OpenAI.

## Setup Cepat

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Buat file `.env` di root folder (copy dari `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` dan masukkan OpenAI API key Anda:

```
OPENAI_API_KEY=sk-YOUR_API_KEY_HERE
PORT=3000
NODE_ENV=development
```

### 3. Dapatkan OpenAI API Key

1. Buka [platform.openai.com](https://platform.openai.com)
2. Login atau buat akun baru
3. Pergi ke **API Keys** → Create new secret key
4. Copy key dan paste ke file `.env`

> ⚠️ **PENTING**: Jangan share API key Anda!

### 4. Jalankan Proxy Server

**Mode Development (dengan auto-reload):**
```bash
npm run dev
```

**Mode Production:**
```bash
npm start
```

Server akan berjalan di: `http://localhost:3000`

### 5. Buka Frontend

Buka browser dan pergi ke folder `pages`:
- [pages/login.html](pages/login.html) - untuk login
- [pages/dashboard.html](pages/dashboard.html) - dashboard utama

Atau buka dengan live server di VS Code.

---

## Fitur HealthMind (AI Assistant)

Setelah proxy server aktif, Anda bisa:

1. **Buka Dashboard** → Tab HealthMind 🤖
2. **Klik "Status Proxy"** untuk cek koneksi
3. **Tanya apapun** tentang kesehatan Anda

### Contoh Pertanyaan:

- "Apa alergiku?" → AI menampilkan data alergi Anda
- "Riwayat penyakit apa saja?" → AI menunjukkan riwayat kesehatan
- "Demam apa yang harus dilakukan?" → AI beri saran
- "Siapa yang buat kamu?" → AI jawab "aku yang buat dia"

---

## Fallback Mode

Jika proxy server **tidak aktif**, HealthMind tetap berfungsi menggunakan:
- Template respon lokal yang sudah di-embed
- Data kesehatan pengguna (alergi, riwayat, monitoring)
- Tidak perlu koneksi internet

---

## Arsitektur

```
maintain-health/
├── index.html                  # Landing page
├── pages/
│   ├── login.html             # Login page
│   ├── dashboard.html         # Main dashboard + HealthMind
│   ├── healthmind.html        # (optional) HealthMind-only page
│   └── ...
├── proxy-server.js            # Node.js Express proxy untuk OpenAI
├── package.json               # Dependencies
├── .env                        # API keys (JANGAN commit!)
├── .env.example               # Template .env
└── README.md                  # File ini

```

### Flow:

```
Browser (dashboard.html)
    ↓ fetch(`/api/chat`)
    ↓
Node.js Proxy (proxy-server.js)
    ↓ fetch(`https://api.openai.com/v1/chat/completions`)
    ↓
OpenAI API
    ↓
Response → Browser
```

---

## Troubleshooting

### ❌ "Proxy server tidak aktif"

**Solusi:**
1. Pastikan server berjalan: `npm run dev` atau `npm start`
2. Cek port 3000 tidak digunakan aplikasi lain:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   
   # macOS/Linux
   lsof -i :3000
   ```
3. Jika sudah terpakai, ubah PORT di `.env`

### ❌ "API Key tidak valid"

**Solusi:**
1. Cek `.env` - pastikan API key benar dan tidak ada spasi
2. Cek billing OpenAI account Anda
3. Buat API key baru dari platform.openai.com

### ⚠️ "OpenAI request failed"

**Solusi:**
1. Cek internet connection
2. Cek OpenAI status: https://status.openai.com/
3. Rate limit tercapai? Tunggu beberapa menit

---

## Security Notes

✅ **Aman:**
- API key tersimpan di `.env` server (hidden dari client)
- Client hanya mengirim pertanyaan, bukan API key
- CORS diatur (hanya localhost)

❌ **Tidak Aman:**
- Jangan expose `.env` ke git
- Jangan bagikan proxy server URL ke public
- Jika deploy ke production, gunakan proper authentication

### `.gitignore`:
```
node_modules/
.env
.DS_Store
```

---

## Development

Untuk menambah fitur atau edit HealthMind logic:

1. **Template respons lokal** → Edit `generateHealthMindReply()` di `dashboard.html`
2. **Server-side logic** → Edit `proxy-server.js`
3. **System prompt** → Ubah di `proxy-server.js` line ~35

---

## Kontribusi & Support

Untuk pertanyaan/issue, silakan contact creator atau buat issue di repo.

---

**Made with ❤️ by Salsabillah Kirana Rahmadani**

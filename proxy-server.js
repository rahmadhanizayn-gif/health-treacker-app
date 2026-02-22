require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY tidak ditemukan di .env');
    process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Proxy server berjalan' });
});

// OpenAI proxy endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, userContext } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const systemPrompt = `Anda asisten kesehatan sederhana Indonesia. 
Data pengguna: 
- Nama: ${userContext?.name || 'Pengguna'}
- Alergi: ${userContext?.alergi || '-'}
- Riwayat penyakit: ${userContext?.rpd || '-'}
- Berat: ${userContext?.berat || '-'}
- Tensi: ${userContext?.tensi || '-'}

Jawab ramah, singkat, dan praktis. Jika ada kondisi serius, sarankan ke dokter.`;

        const openaiResponse = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message }
                ],
                max_tokens: 400,
                temperature: 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const reply = openaiResponse.data.choices?.[0]?.message?.content?.trim();
        
        if (!reply) {
            return res.status(500).json({ error: 'Tidak ada respon dari OpenAI' });
        }

        res.json({ reply });

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
        
        if (error.response?.status === 401) {
            return res.status(401).json({ error: 'API Key tidak valid' });
        }
        
        if (error.response?.status === 429) {
            return res.status(429).json({ error: 'Rate limit tercapai, coba lagi nanti' });
        }

        res.status(500).json({ 
            error: error.response?.data?.error?.message || 'Error komunikasi OpenAI',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Proxy server berjalan di http://localhost:${PORT}`);
    console.log(`📍 Endpoint: POST http://localhost:${PORT}/api/chat`);
    console.log(`🏥 Health check: GET http://localhost:${PORT}/health`);
});

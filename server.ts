import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// API Gemini proxy route
app.post('/api/gemini', async (req, res) => {
  try {
    const { prompt, systemInstruction, temperature } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || undefined,
        temperature: temperature || 0.7
      }
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error('Server Gemini Error:', err);
    res.status(500).json({ error: err.message || 'Error processing request' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', server: 'Nasadef Download Express Server' });
});

// Serve static build in production
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Nasadef Download Server running on http://0.0.0.0:${PORT}`);
});
